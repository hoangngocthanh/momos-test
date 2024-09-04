import { useContext } from "react";

import { GlobalContext } from "src/contexts/GlobalContext";
import { GlobalContextProps } from "src/types";

const useGlobal = () => useContext(GlobalContext) as GlobalContextProps;

export default useGlobal;
