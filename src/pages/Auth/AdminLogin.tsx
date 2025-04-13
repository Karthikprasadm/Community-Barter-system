
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useBarterContext } from "@/context/BarterContext";
import { Shield, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{username?: string; password?: string}>({});
  const { adminLogin } = useBarterContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: {username?: string; password?: string} = {};
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password should be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await adminLogin(username, password);
      if (success) {
        toast({
          title: "Admin Access Granted",
          description: "Welcome to the admin dashboard.",
          variant: "default",
        });
        navigate("/admin");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid admin credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "System Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-700 flex items-center justify-center gap-2">
            <Shield className="h-6 w-6" />
            Admin Access
          </h2>
          <p className="mt-2 text-gray-600">Sign in with your admin credentials</p>
        </div>
        
        <Card className="border-purple-200">
          <CardHeader className="bg-purple-50 border-b border-purple-100">
            <CardTitle className="text-purple-800">Admin Sign In</CardTitle>
            <CardDescription>
              Restricted access for system administrators
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex justify-between">
                  <span>Username</span>
                  {errors.username && (
                    <span className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.username}
                    </span>
                  )}
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors({...errors, username: undefined});
                  }}
                  className={errors.username ? "border-red-300" : ""}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex justify-between">
                  <span>Password</span>
                  {errors.password && (
                    <span className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.password}
                    </span>
                  )}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({...errors, password: undefined});
                  }}
                  className={errors.password ? "border-red-300" : ""}
                  autoComplete="current-password"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 bg-purple-50 border-t border-purple-100">
              <Button 
                type="submit" 
                className="w-full bg-purple-700 hover:bg-purple-800" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : "Access Admin Panel"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center text-xs text-gray-500">
          <p>
            For demo purposes, use: wingspawn / wingspawn
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
