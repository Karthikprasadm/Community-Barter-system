// Fix for missing types in Express Request bodies
import "express";
declare module "express-serve-static-core" {
  interface Request {
    body: any;
  }
}
