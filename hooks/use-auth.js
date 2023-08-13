import { useSelector } from "react-redux";
import { selectCurrentToken } from "../store/authSlice";
import jwtDecode from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isEmployee = false;
  let isManager = false;
  let isAdmin = false;
  let status = "User"; // status - highest role available to user

  if (token) {
    const decoded = jwtDecode(token);
    const { id, username, roles } = decoded.UserInfo;

    isEmployee = roles.includes("Employee");
    isManager = roles.includes("Manager");
    isAdmin = roles.includes("Admin");

    if (isEmployee) status = "Employee";
    if (isManager) status = "Manager";
    if (isAdmin) status = "Admin";

    return { id, username, roles, status, isEmployee, isManager, isAdmin };
  }

  return { id: "", username: "", roles: ["Guest"], isEmployee, isManager, isAdmin, status };
};

export default useAuth;
