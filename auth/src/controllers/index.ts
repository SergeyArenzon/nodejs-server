import { loginController } from "./login-controller";
import { logoutController } from "./logout-controller";
import { registerController }  from './register-controller';
import { currentUserController } from './current-user-controller';


declare global {
  namespace Express {
    interface User {
      id: string,
      email: string,
      firstName: string,
      lastName: string,
    }
  }
}

export { 
  loginController, 
  logoutController, 
  registerController, 
  currentUserController 
};


