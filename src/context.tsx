import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

interface AnimateContextData {
  addAnimateFunction: (func: (delta: number, gameTime: number) => void) => void;
  removeAnimateFunction: (
    func: (delta: number, gameTime: number) => void
  ) => void;
}

export const AnimateContext = createContext<AnimateContextData>({
  addAnimateFunction: () => {
    throw new Error("pls use animate parent");
  },
  removeAnimateFunction: () => {
    throw new Error("pls use animate parent");
  },
});

export default function Animate({ children }: PropsWithChildren<{}>) {
  const animateFunction = useRef<((delta: number, gameTime: number) => void)[]>(
    []
  );
  const globalTime = useRef(0);

  const requestRef = useRef(0);

  const contextData: AnimateContextData = {
    addAnimateFunction: useCallback(
      (func) => {
        animateFunction.current = [...animateFunction.current, func];
      },
      [animateFunction]
    ),
    removeAnimateFunction: useCallback(
      (func) => {
        animateFunction.current = animateFunction.current.filter(
          (f) => f !== func
        );
      },
      [animateFunction]
    ),
  };

  const animate = useCallback(
    (time: number) => {
      globalTime.current += time;
      animateFunction.current.forEach((animatef) =>
        animatef(time, globalTime.current)
      );
      requestRef.current = requestAnimationFrame(animate);
    },
    [animateFunction]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  return (
    <AnimateContext.Provider value={contextData}>
      {children}
    </AnimateContext.Provider>
  );
}

export const useAnimation = (
  func: (delta?: number, gameTime?: number) => void
) => {
  const { addAnimateFunction, removeAnimateFunction } = useContext(
    AnimateContext
  );
  useEffect(() => {
    addAnimateFunction(func);
    return () => {
      removeAnimateFunction(func);
    };
  }, []);
  useLayoutEffect(() => {
    func(0, 0);
  }, []);
};
