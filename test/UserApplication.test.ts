import { UserApplication } from '../src/application/UserApplicationService';
import bcrypt from 'bcryptjs';
import { AuthApplication } from '../src/application/AuthAplications';

jest.mock('bcryptjs');
jest.mock('../src/application/AuthAplications', () => ({
  AuthApplication: {
    generateToken: jest.fn()
  }
}));

describe('UserApplication', () => {
  let userPortMock: any;
  let userApp: UserApplication;

  beforeEach(() => {
    userPortMock = {
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      getAllUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    userApp = new UserApplication(userPortMock);

    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debe retornar token si email y password son correctos', async () => {
      const fakeUser = { id: 1, email: 'test@test.com', password: 'hashedPassword' };

      userPortMock.getUserByEmail.mockResolvedValue(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (AuthApplication.generateToken as jest.Mock).mockReturnValue('token123');

      const token = await userApp.login('test@test.com', 'password123');

      expect(userPortMock.getUserByEmail).toHaveBeenCalledWith('test@test.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(AuthApplication.generateToken).toHaveBeenCalledWith({ id: 1, email: 'test@test.com' });
      expect(token).toBe('token123');
    });

    it('debe lanzar error si el usuario no existe', async () => {
      userPortMock.getUserByEmail.mockResolvedValue(null);

      await expect(userApp.login('noexiste@test.com', 'password')).rejects.toThrow('User not found');
    });

    it('debe lanzar error si el password es incorrecto', async () => {
      const fakeUser = { id: 1, email: 'test@test.com', password: 'hashedPassword' };
      userPortMock.getUserByEmail.mockResolvedValue(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(userApp.login('test@test.com', 'wrongpassword')).rejects.toThrow('Credentials are Invalid');
    });
  });

  describe('createUser', () => {
    it('debe crear usuario si email no existe', async () => {
      const newUser = { email: 'new@test.com', password: 'pass123', name: 'New User', status: 1 };
      userPortMock.getUserByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPass');
      userPortMock.createUser.mockResolvedValue(1);

      const id = await userApp.createUser(newUser);

      expect(userPortMock.getUserByEmail).toHaveBeenCalledWith('new@test.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('pass123', 10);
      expect(userPortMock.createUser).toHaveBeenCalledWith({ ...newUser, password: 'hashedPass' });
      expect(id).toBe(1);
    });

    it('debe lanzar error si email ya existe', async () => {
      userPortMock.getUserByEmail.mockResolvedValue({ id: 1, email: 'exists@test.com', password: 'hashed' });

      await expect(userApp.createUser({ email: 'exists@test.com', password: 'pass', name: 'User', status: 1 }))
        .rejects.toThrow('El usuario ya exite');
    });
  });

  describe('updateUser', () => {
    it('debe actualizar usuario si existe y no hay conflicto con email', async () => {
      const existingUser = { id: 1, email: 'test@test.com', status: 1 };
      userPortMock.getUserById.mockResolvedValue(existingUser);
      userPortMock.getUserByEmail.mockResolvedValue(null);
      userPortMock.updateUser.mockResolvedValue(true);

      const result = await userApp.updateUser(1, { email: 'newemail@test.com' });

      expect(userPortMock.getUserById).toHaveBeenCalledWith(1);
      expect(userPortMock.getUserByEmail).toHaveBeenCalledWith('newemail@test.com');
      expect(userPortMock.updateUser).toHaveBeenCalledWith(1, { email: 'newemail@test.com' });
      expect(result).toBe(true);
    });

    it('debe lanzar error si usuario no existe', async () => {
      userPortMock.getUserById.mockResolvedValue(null);

      await expect(userApp.updateUser(1, { email: 'newemail@test.com' })).rejects.toThrow('El usuario no exite');
    });

    it('debe lanzar error si el email ya está tomado por otro usuario', async () => {
      const existingUser = { id: 1, email: 'old@test.com' };
      const emailTaken = { id: 2, email: 'newemail@test.com' };
      userPortMock.getUserById.mockResolvedValue(existingUser);
      userPortMock.getUserByEmail.mockResolvedValue(emailTaken);

      await expect(userApp.updateUser(1, { email: 'newemail@test.com' })).rejects.toThrow('Error en actualizar email');
    });
  });

  describe('getAllUsers', () => {
    it('debe retornar la lista de usuarios', async () => {
      const users = [{ id: 1, email: 'a@test.com' }, { id: 2, email: 'b@test.com' }];
      userPortMock.getAllUser.mockResolvedValue(users);

      const result = await userApp.getAllUsers();

      expect(userPortMock.getAllUser).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('getUserById', () => {
    it('debe retornar un usuario por id', async () => {
      const user = { id: 1, email: 'a@test.com' };
      userPortMock.getUserById.mockResolvedValue(user);

      const result = await userApp.getUserById(1);

      expect(userPortMock.getUserById).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });
  });

  describe('deleteUser', () => {
    it('debe eliminar usuario si existe', async () => {
      userPortMock.getUserById.mockResolvedValue({ id: 1, email: 'a@test.com' });
      userPortMock.deleteUser.mockResolvedValue(true);

      const result = await userApp.deleteUser(1);

      expect(userPortMock.getUserById).toHaveBeenCalledWith(1);
      expect(userPortMock.deleteUser).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('debe lanzar error si usuario no existe', async () => {
      userPortMock.getUserById.mockResolvedValue(null);

      await expect(userApp.deleteUser(1)).rejects.toThrow('No se encontro el usuario');
    });
  });
});
