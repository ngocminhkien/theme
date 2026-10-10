import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { dbPool } from '../config/database.js';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string;
  role: 'customer' | 'author' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  created_at: Date;
}

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await dbPool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (!rows.length) return null;
    return rows[0] as User;
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await dbPool.query<RowDataPacket[]>(
      'SELECT id, email, full_name, phone, role, status, created_at FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    if (!rows.length) return null;
    return rows[0] as User;
  }

  static async create(userData: {
    email: string;
    password_hash: string;
    full_name: string;
    phone?: string;
    role?: string;
  }): Promise<number> {
    const [result] = await dbPool.query<ResultSetHeader>(
      'INSERT INTO users (email, password_hash, full_name, phone, role) VALUES (?, ?, ?, ?, ?)',
      [userData.email, userData.password_hash, userData.full_name, userData.phone || null, userData.role || 'customer']
    );
    return result.insertId;
  }
}
