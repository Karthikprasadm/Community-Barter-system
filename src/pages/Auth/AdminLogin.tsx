
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useBarterContext } from "@/context/BarterContext";
import { Shield } from "lucide-react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { adminLogin } = useBarterContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await adminLogin(username, password);
      if (success) {
        navigate("/admin");
      }
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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {isLoading ? "Signing in..." : "Access Admin Panel"}
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
