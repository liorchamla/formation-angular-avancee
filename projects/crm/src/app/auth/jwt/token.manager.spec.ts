import { LocalStorageTokenManager } from './local-storage';
import { SessionStorageTokenManager } from './session-storage';

/**
 * Dans ce fichier, nous allons tester nos deux TokenManager :
 * - LocalStorageTokenManager
 * - SessionStorageTokenManager
 *
 * On va donc écrire une suite qui en contiendra deux autres.
 */
describe('Token Management', () => {
  // Tests du LocalStorageTokenManager
  describe('LocalStorageTokenManager', () => {
    const tokenManager = new LocalStorageTokenManager();
    const storage = window.localStorage;

    beforeEach(() => storage.clear());

    it('should store token', () => {
      tokenManager.storeToken('test');

      expect(storage.getItem('authToken')).toEqual('test');
    });

    it('should retrieve token', (done: DoneFn) => {
      // En imaginant qu'on ait déjà un token dans le storage
      storage.setItem('authToken', 'test');

      // Quand je demande à le récupérer
      tokenManager.loadToken().subscribe((token) => {
        expect(token).toEqual('test');
        done();
      });
    });

    it('should remove token', () => {
      // En imaginant qu'on ait déjà un token dans le storage
      storage.setItem('authToken', 'test');

      // Si on demande à le supprimer
      tokenManager.removeToken();

      expect(storage.getItem('authToken')).toBeNull();
    });
  });

  // Tests du SessionStorageTokenManager
  describe('SessionStorageTokenManager', () => {
    const tokenManager = new SessionStorageTokenManager();
    const storage = window.sessionStorage;

    beforeEach(() => storage.clear());

    it('should store token', () => {
      tokenManager.storeToken('test');

      expect(storage.getItem('authToken')).toEqual('test');
    });

    it('should retrieve token', (done: DoneFn) => {
      // En imaginant qu'on ait déjà un token dans le storage
      storage.setItem('authToken', 'test');

      // Quand je demande à le récupérer
      tokenManager.loadToken().subscribe((token) => {
        expect(token).toEqual('test');
        done();
      });
    });

    it('should remove token', () => {
      // En imaginant qu'on ait déjà un token dans le storage
      storage.setItem('authToken', 'test');

      // Si on demande à le supprimer
      tokenManager.removeToken();

      expect(storage.getItem('authToken')).toBeNull();
    });
  });
});
