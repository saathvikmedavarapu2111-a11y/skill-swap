import { userRepository, sanitizeUser, SafeUser } from "../data/users.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { LoginInput, RegisterInput } from "../validators/auth.validator.js";

export interface AuthResult {
  token: string;
  user: SafeUser;
}

export class AuthService {
  /**
   * Authenticates a student user with email and password
   */
  public async login(input: LoginInput): Promise<AuthResult> {
    const { email, password } = input;
    const user = userRepository.findByEmail(email);

    if (!user) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    return {
      token,
      user: sanitizeUser(user),
    };
  }

  /**
   * Registers a new student user
   */
  public async register(input: RegisterInput): Promise<AuthResult> {
    const existingEmail = userRepository.findByEmail(input.email);
    if (existingEmail) {
      const error: any = new Error("An account with this email already exists");
      error.statusCode = 409;
      throw error;
    }

    const handle = input.handle || `@${input.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
    const existingHandle = userRepository.findByHandle(handle);
    if (existingHandle) {
      const error: any = new Error("This handle is already taken");
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await hashPassword(input.password);

    const defaultAvatar =
      input.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(input.name)}`;

    const newUser = userRepository.create({
      email: input.email,
      passwordHash,
      name: input.name,
      handle,
      avatar: defaultAvatar,
      college: input.college || "University Campus",
      major: input.major || "General Studies",
      year: input.year || "Undergraduate",
      bio: input.bio || "Passionate learner and skill exchanger.",
      karmaPoints: 100, // Starter karma bonus
      swapsCompleted: 0,
      rating: 5.0,
      reviewsCount: 0,
      badges: ["New Member", "Early Adopter"],
      skillsTeaching: input.skillsTeaching || [],
      skillsLearning: input.skillsLearning || [],
      availability: input.availability || "Flexible on weekdays",
      socialLinks: input.socialLinks || {},
      status: "online",
    });

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
    });

    return {
      token,
      user: sanitizeUser(newUser),
    };
  }

  /**
   * Retrieves the authenticated user profile
   */
  public async getMe(userId: string): Promise<SafeUser> {
    const user = userRepository.findById(userId);
    if (!user) {
      const error: any = new Error("User account not found");
      error.statusCode = 404;
      throw error;
    }
    return sanitizeUser(user);
  }
}

export const authService = new AuthService();
