import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { dbPool, isDbOffline, markDbOffline } from '../config/database.js';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string;
  role: 'customer' | 'author' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  avatar_url?: string | null;
  created_at: Date;
}

export interface SafeUser {
  id: number;
  email: string;
  full_name: string;
  phone?: string | null;
  role: 'customer' | 'author' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  avatar_url?: string | null;
  created_at: Date;
}

const fallbackUsers: User[] = [
  {
    id: 1,
    email: 'admin@thememarket.local',
    password_hash: bcrypt.hashSync('Admin@2026', 10),
    full_name: 'Super Administrator',
    phone: '0909999999',
    role: 'admin',
    status: 'active',
    created_at: new Date('2026-10-10T08:00:00Z'),
  },
  {
    id: 2,
    email: 'author@xtemos.local',
    password_hash: bcrypt.hashSync('Author@2026', 10),
    full_name: 'XTemos Studio Official',
    phone: '0908888888',
    role: 'author',
    status: 'active',
    created_at: new Date('2026-10-10T08:00:00Z'),
  },
  {
    id: 3,
    email: 'customer@thememarket.local',
    password_hash: bcrypt.hashSync('Customer@2026', 10),
    full_name: 'Nguyễn Văn Khách Hàng',
    phone: '0901234567',
    role: 'customer',
    status: 'active',
    created_at: new Date('2026-10-10T08:00:00Z'),
  },
  {
    id: 4,
    email: 'admin@woodmart.vn',
    password_hash: bcrypt.hashSync('Admin@123456', 10),
    full_name: 'Ngọc Minh Kiên (Admin)',
    phone: '0912345678',
    role: 'admin',
    status: 'active',
    created_at: new Date('2026-10-13T08:00:00Z'),
  },
];

function toSafeUser(user: User): SafeUser {
  const { password_hash, ...safe } = user;
  return safe;
}

export class UserModel {
  static getFallbackUsers(): User[] {
    return fallbackUsers;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const normalized = email.toLowerCase().trim();
    if (isDbOffline()) {
      return fallbackUsers.find((u) => u.email.toLowerCase() === normalized) || null;
    }
    try {
      const [rows] = await dbPool.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ? LIMIT 1',
        [email]
      );
      if (!rows.length) return null;
      return rows[0] as User;
    } catch (err) {
      markDbOffline(err);
      return fallbackUsers.find((u) => u.email.toLowerCase() === normalized) || null;
    }
  }

  static async findById(id: number): Promise<SafeUser | null> {
    if (isDbOffline()) {
      const found = fallbackUsers.find((u) => u.id === id);
      return found ? toSafeUser(found) : null;
    }
    try {
      const [rows] = await dbPool.query<RowDataPacket[]>(
        'SELECT id, email, full_name, phone, role, status, created_at FROM users WHERE id = ? LIMIT 1',
        [id]
      );
      if (!rows.length) return null;
      return rows[0] as SafeUser;
    } catch (err) {
      markDbOffline(err);
      const found = fallbackUsers.find((u) => u.id === id);
      return found ? toSafeUser(found) : null;
    }
  }

  static async findFullById(id: number): Promise<User | null> {
    if (isDbOffline()) {
      return fallbackUsers.find((u) => u.id === id) || null;
    }
    try {
      const [rows] = await dbPool.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE id = ? LIMIT 1',
        [id]
      );
      if (!rows.length) return null;
      return rows[0] as User;
    } catch (err) {
      markDbOffline(err);
      return fallbackUsers.find((u) => u.id === id) || null;
    }
  }

  static async create(userData: {
    email: string;
    password_hash: string;
    full_name: string;
    phone?: string;
    role?: string;
    avatar_url?: string | null;
  }): Promise<number> {
    const defaultRole: User['role'] =
      userData.role === 'admin' || userData.role === 'author' ? userData.role : 'customer';
    try {
      const [result] = await dbPool.query<ResultSetHeader>(
        'INSERT INTO users (email, password_hash, full_name, phone, role, avatar_url) VALUES (?, ?, ?, ?, ?, ?)',
        [userData.email, userData.password_hash, userData.full_name, userData.phone || null, defaultRole, userData.avatar_url || null]
      );
      return result.insertId;
    } catch {
      try {
        const [result] = await dbPool.query<ResultSetHeader>(
          'INSERT INTO users (email, password_hash, full_name, phone, role) VALUES (?, ?, ?, ?, ?)',
          [userData.email, userData.password_hash, userData.full_name, userData.phone || null, defaultRole]
        );
        return result.insertId;
      } catch {
        const nextId = fallbackUsers.reduce((max, u) => Math.max(max, u.id), 0) + 1;
        fallbackUsers.push({
          id: nextId,
          email: userData.email,
          password_hash: userData.password_hash,
          full_name: userData.full_name,
          phone: userData.phone,
          role: defaultRole,
          status: 'active',
          avatar_url: userData.avatar_url || null,
          created_at: new Date(),
        });
        return nextId;
      }
    }
  }

  static async findOrCreateOAuthUser(data: {
    email: string;
    full_name: string;
    avatar_url?: string | null;
  }): Promise<SafeUser> {
    const email = data.email.toLowerCase().trim();
    const existing = await this.findByEmail(email);

    if (existing) {
      if (existing.status === 'banned') {
        throw new Error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ ban quản trị.');
      }
      if (data.avatar_url && !existing.avatar_url) {
        existing.avatar_url = data.avatar_url;
        try {
          await dbPool.query('UPDATE users SET avatar_url = ? WHERE id = ?', [data.avatar_url, existing.id]);
        } catch {
          // ignore column missing
        }
      }
      return toSafeUser(existing);
    }

    const randomPassword = crypto.randomUUID() + '-' + Date.now();
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(randomPassword, salt);

    const userId = await this.create({
      email,
      password_hash,
      full_name: data.full_name || email.split('@')[0],
      avatar_url: data.avatar_url,
      role: 'customer',
    });

    const created = await this.findById(userId);
    if (!created) {
      throw new Error('Không thể tạo tài khoản người dùng từ OAuth.');
    }
    return created;
  }

  static async updateRole(id: number, role: User['role']): Promise<boolean> {
    const normalizedRole: User['role'] =
      role === 'admin' || role === 'author' ? role : 'customer';
    try {
      const [result] = await dbPool.query<ResultSetHeader>(
        'UPDATE users SET role = ? WHERE id = ?',
        [normalizedRole, id]
      );
      return result.affectedRows > 0;
    } catch {
      const found = fallbackUsers.find((u) => u.id === id);
      if (!found) return false;
      found.role = normalizedRole;
      return true;
    }
  }

  static async updateProfile(id: number, data: { full_name?: string; phone?: string }): Promise<boolean> {
    try {
      const updates: string[] = [];
      const values: (string | null | number)[] = [];
      if (data.full_name !== undefined) {
        updates.push('full_name = ?');
        values.push(data.full_name.trim());
      }
      if (data.phone !== undefined) {
        updates.push('phone = ?');
        values.push(data.phone ? data.phone.trim() : null);
      }
      if (!updates.length) return true;
      values.push(id);
      const [result] = await dbPool.query<ResultSetHeader>(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch {
      const found = fallbackUsers.find((u) => u.id === id);
      if (!found) return false;
      if (data.full_name !== undefined) found.full_name = data.full_name.trim();
      if (data.phone !== undefined) found.phone = data.phone ? data.phone.trim() : undefined;
      return true;
    }
  }

  static async updatePassword(id: number, password_hash: string): Promise<boolean> {
    try {
      const [result] = await dbPool.query<ResultSetHeader>(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [password_hash, id]
      );
      return result.affectedRows > 0;
    } catch {
      const found = fallbackUsers.find((u) => u.id === id);
      if (!found) return false;
      found.password_hash = password_hash;
      return true;
    }
  }
}

