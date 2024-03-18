import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";

// Use throughout your app instead of plain `useDispatch`
const useAppDispatch = () => useDispatch<AppDispatch>();

export default useAppDispatch;
