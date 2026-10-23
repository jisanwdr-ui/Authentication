import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 text-center shadow-lg">
        <img
          src={
            user.avatar ||
            "https://placehold.co/150x150?text=User"
          }
          alt="Profile"
          className="mx-auto mb-4 h-28 w-28 rounded-full object-cover"
        />

        <h1 className="text-3xl font-bold">
          Welcome, {user.fullName}!
        </h1>

        <div className="mt-6 space-y-3 text-left">
          <p>
            <strong>Username:</strong> {user.username}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>Created:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 rounded bg-red-600 px-6 py-3 text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;