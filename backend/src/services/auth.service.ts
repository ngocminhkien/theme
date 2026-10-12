import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, User, SafeUser } from '../models/user.model.js';
import { ENV } from '../config/env.js';

export class AuthService {
  static async register(data: { email: string; password: string; full_name: string; phone?: string }) {
    const email = data.email.toLowerCase().trim();
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      throw new Error('Email đã được đăng ký trong hệ thống.');
    }

    if (!data.password || data.password.length < 6) {
      throw new Error('Mật khẩu phải chứa ít nhất 6 ký tự.');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(data.password, salt);

    const userId = await UserModel.create({
      email,
      password_hash,
      full_name: data.full_name.trim(),
      phone: data.phone?.trim(),
    });

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('Lỗi tạo tài khoản người dùng.');
    }
    const token = this.generateToken(user);
    return { user, token };
  }

  static async login(emailInput: string, passwordInput: string) {
    const email = emailInput.toLowerCase().trim();
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }

    if (user.status === 'banned') {
      throw new Error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
    }

    const isMatch = await bcrypt.compare(passwordInput, user.password_hash);
    if (!isMatch) {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }

    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role,
      status: user.status,
      created_at: user.created_at,
    };
    const token = this.generateToken(safeUser);
    return { user: safeUser, token };
  }

  static async getProfile(userId: number): Promise<SafeUser> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('Không tìm thấy thông tin tài khoản.');
    }
    return user;
  }

  static async updateProfile(userId: number, data: { full_name?: string; phone?: string }): Promise<SafeUser> {
    if (data.full_name !== undefined && !data.full_name.trim()) {
      throw new Error('Họ và tên không được để trống.');
    }
    await UserModel.updateProfile(userId, data);
    return this.getProfile(userId);
  }

  static async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<boolean> {
    if (!newPassword || newPassword.length < 6) {
      throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự.');
    }
    const user = await UserModel.findFullById(userId);
    if (!user) {
      throw new Error('Không tìm thấy tài khoản.');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      throw new Error('Mật khẩu hiện tại không chính xác.');
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);
    return await UserModel.updatePassword(userId, newHash);
  }

  static generateToken(user: Partial<SafeUser | User>) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      ENV.JWT.SECRET,
      { expiresIn: '7d' }
    );
  }
}

