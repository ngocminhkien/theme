import bcrypt from 'bcryptjs';

export interface InitialAdminInput {
  email: string;
  password: string;
  fullName: string;
}

export interface InitialAdminConnection {
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  execute(sql: string, values?: unknown[]): Promise<[unknown, unknown]>;
}

type ExistingUser = { id: number; email: string; role?: string };

export type InitialAdminResult =
  | { status: 'created'; id: number; email: string }
  | { status: 'exists'; id: number; email: string };

function normalizeInput(input: InitialAdminInput): InitialAdminInput {
  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();
  const password = input.password;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 191) {
    throw new Error('ADMIN_EMAIL không hợp lệ.');
  }
  if (fullName.length < 2 || fullName.length > 150) {
    throw new Error('Tên quản trị viên phải có từ 2 đến 150 ký tự.');
  }
  if (password.length < 12) {
    throw new Error('ADMIN_PASSWORD phải có ít nhất 12 ký tự.');
  }

  return { email, password, fullName };
}

/**
 * Creates exactly one first administrator. The transaction and SELECT ... FOR
 * UPDATE make concurrent bootstrap attempts serialize; an existing account is
 * never changed or promoted by this helper.
 */
export async function createInitialAdmin(
  connection: InitialAdminConnection,
  rawInput: InitialAdminInput,
): Promise<InitialAdminResult> {
  const input = normalizeInput(rawInput);
  let transactionOpen = false;

  try {
    await connection.beginTransaction();
    transactionOpen = true;

    const [adminResult] = await connection.execute(
      'SELECT id, email FROM users WHERE role = ? LIMIT 1 FOR UPDATE',
      ['admin'],
    );
    const existingAdmin = (adminResult as ExistingUser[])[0];
    if (existingAdmin) {
      await connection.rollback();
      transactionOpen = false;
      return { status: 'exists', id: existingAdmin.id, email: existingAdmin.email };
    }

    const [emailResult] = await connection.execute(
      'SELECT id, email, role FROM users WHERE email = ? LIMIT 1 FOR UPDATE',
      [input.email],
    );
    const existingEmail = (emailResult as ExistingUser[])[0];
    if (existingEmail) {
      throw new Error('Email đã thuộc một tài khoản hiện có; từ chối tự động nâng quyền quản trị.');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const [insertResult] = await connection.execute(
      `INSERT INTO users (email, password_hash, full_name, role, status)
       VALUES (?, ?, ?, ?, ?)`,
      [input.email, passwordHash, input.fullName, 'admin', 'active'],
    );
    const inserted = insertResult as { insertId?: number };
    if (!Number.isSafeInteger(inserted.insertId) || !inserted.insertId || inserted.insertId <= 0) {
      throw new Error('Không thể xác nhận tài khoản quản trị vừa tạo.');
    }

    await connection.commit();
    transactionOpen = false;
    return { status: 'created', id: inserted.insertId, email: input.email };
  } catch (error) {
    if (transactionOpen) {
      try { await connection.rollback(); } catch { /* Preserve the original failure. */ }
    }
    throw error;
  }
}
