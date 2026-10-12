import path from 'node:path';
import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Support the documented root .env as well as a backend-local .env without
// overriding variables supplied explicitly by the terminal or deployment.
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: false });
dotenv.config({ path: path.resolve(process.cwd(), '..', '.env'), override: false });

function requiredEnvironment(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Thiếu biến môi trường bắt buộc: ${name}`);
  return value;
}

async function readHidden(label) {
  if (!stdin.isTTY || !stdout.isTTY || typeof stdin.setRawMode !== 'function') {
    throw new Error('Terminal không hỗ trợ nhập mật khẩu ẩn. Hãy đặt ADMIN_EMAIL, ADMIN_PASSWORD và ADMIN_FULL_NAME qua biến môi trường.');
  }

  return new Promise((resolve, reject) => {
    let value = '';
    const wasRaw = stdin.isRaw;
    stdout.write(label);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    const cleanup = () => {
      stdin.off('data', onData);
      stdin.setRawMode(Boolean(wasRaw));
      stdin.pause();
    };
    const fail = (error) => { cleanup(); reject(error); };
    const finish = () => { cleanup(); stdout.write('\n'); resolve(value); };
    const onData = (chunk) => {
      for (const character of String(chunk)) {
        if (character === '\u0003') return fail(new Error('Đã hủy tạo tài khoản Admin.'));
        if (character === '\r' || character === '\n') return finish();
        if (character === '\u0008' || character === '\u007f') {
          value = value.slice(0, -1);
        } else if (character >= ' ') {
          value += character;
        }
      }
    };
    stdin.on('data', onData);
  });
}

async function readInput() {
  const configuredEmail = process.env.ADMIN_EMAIL?.trim();
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const configuredName = process.env.ADMIN_FULL_NAME?.trim();
  if (configuredEmail || configuredPassword || configuredName) {
    if (!configuredEmail || !configuredPassword || !configuredName) {
      throw new Error('Khi dùng biến môi trường, phải đặt đủ ADMIN_EMAIL, ADMIN_PASSWORD và ADMIN_FULL_NAME.');
    }
    return { email: configuredEmail, password: configuredPassword, fullName: configuredName };
  }

  if (!stdin.isTTY || !stdout.isTTY) {
    throw new Error('Không có terminal tương tác. Hãy đặt ADMIN_EMAIL, ADMIN_PASSWORD và ADMIN_FULL_NAME.');
  }
  const prompt = createInterface({ input: stdin, output: stdout });
  let closed = false;
  try {
    const email = await prompt.question('Email quản trị đầu tiên: ');
    const fullName = await prompt.question('Họ tên quản trị viên: ');
    prompt.close();
    closed = true;
    return { email, fullName, password: await readHidden('Mật khẩu (tối thiểu 12 ký tự): ') };
  } finally {
    if (!closed) prompt.close();
  }
}

async function main() {
  const input = await readInput();
  const dbName = requiredEnvironment('DB_NAME');
  const dbUser = requiredEnvironment('DB_USER');
  const dbPassword = requiredEnvironment('DB_PASSWORD');
  const { createInitialAdmin } = await import('../dist/services/initial-admin.service.js');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST?.trim() || '127.0.0.1',
    port: Number.parseInt(process.env.DB_PORT || '3306', 10),
    database: dbName,
    user: dbUser,
    password: dbPassword,
  });

  try {
    const result = await createInitialAdmin(connection, input);
    if (result.status === 'exists') {
      console.log(`Đã có Admin (ID ${result.id}, ${result.email}). Không thay đổi tài khoản hiện có.`);
      return;
    }
    console.log(`Đã tạo Admin ID ${result.id} (${result.email}). Bạn có thể đăng nhập tại ứng dụng Admin.`);
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : 'Không thể tạo tài khoản Admin.';
  console.error(`Tạo Admin thất bại: ${message}`);
  process.exitCode = 1;
});
