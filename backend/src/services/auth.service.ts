import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, User } from '../models/user.model.js';
import { ENV } from '../config/env.js';

export class AuthService {
  static async register(data: { email: string; password: string; full_name: string; phone?: string }) {
    const existing = await UserModel.findByEmail(data.email);
    if (existing) {
      throw new Error('Email đã được đăng ký trong hệ thống.');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(data.password, salt);

    const userId = await UserModel.create({
      email: data.email,
      password_hash,
      full_name: data.full_name,
      phone: data.phone,
    });

    const user = await UserModel.findById(userId);
    const token = this.generateToken(user!);
    return { user, token };
  }

  static async login(email: string, password: string) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }

    const token = this.generateToken(user);
    const { password_hash, ...safeUser } = user;
    return { user: safeUser, token };
  }

  static generateToken(user: Partial<User>) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      ENV.JWT.SECRET,
      { expiresIn: '7d' }
    );
  }
}
