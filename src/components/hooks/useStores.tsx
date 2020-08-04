import React from "react";
import { StoresContext } from "../contexts/StoresContext";

export const useStores = () => React.useContext(StoresContext);
