
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useBarterContext } from "@/context/BarterContext";
import { Shield, AlertCircle, Loader2, Eye, EyeOff, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{username?: string; password?: string}>({});
  const [pageLoaded, setPageLoaded] = useState(false);
  const { adminLogin } = useBarterContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simulate load time for skeleton screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-50 to-white">
      <div className="w-full max-w-md space-y-8">
        {!pageLoaded ? (
          // Skeleton loading state
          <div className="space-y-8">
            <div className="flex flex-col items-center space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-[450px] w-full rounded-lg" />
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-3xl font-bold text-purple-700 flex items-center justify-center gap-2">
                <Shield className="h-8 w-8" />
                Admin Access
              </h2>
              <p className="mt-2 text-gray-600">Sign in with your admin credentials</p>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="border-purple-200 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50 border-b border-purple-100">
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
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <User className="h-4 w-4" />
                        </div>
                        <Input
                          id="username"
                          type="text"
                          placeholder="admin username"
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value);
                            if (errors.username) setErrors({...errors, username: undefined});
                          }}
                          className={cn(
                            "pl-10 transition-all duration-200 border-gray-300 focus:border-purple-400",
                            errors.username ? "border-red-300" : "",
                            "hover:border-purple-300"
                          )}
                          autoComplete="username"
                          required
                        />
                      </div>
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
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Lock className="h-4 w-4" />
                        </div>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors({...errors, password: undefined});
                          }}
                          className={cn(
                            "pl-10 pr-10 transition-all duration-200 border-gray-300 focus:border-purple-400",
                            errors.password ? "border-red-300" : "",
                            "hover:border-purple-300"
                          )}
                          autoComplete="current-password"
                          required
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4 bg-gradient-to-r from-purple-50 to-purple-100 border-t border-purple-100">
                    <motion.div 
                      whileHover={{ scale: 1.03 }} 
                      whileTap={{ scale: 0.97 }}
                      className="w-full"
                    >
                      <Button 
                        type="submit" 
                        className="w-full bg-purple-700 hover:bg-purple-800 transition-all duration-300 shadow-md hover:shadow-lg" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : "Access Admin Panel"}
                      </Button>
                    </motion.div>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-center text-xs text-gray-500">
              <p className="p-3 bg-purple-50 border border-purple-100 rounded-md">
                For demo purposes, use: <span className="font-semibold">wingspawn</span> / <span className="font-semibold">wingspawn</span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
