import dynamic from "next/dynamic";

const HomeNoSSR = dynamic(() => import("./Home"), {
  ssr: false,
});

export default HomeNoSSR;
