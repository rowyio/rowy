import { forwardRef, cloneElement } from "react";
import { useTheme, Slide } from "@mui/material";
import { Transition } from "react-transition-group";
import { TransitionProps } from "react-transition-group/Transition";
import { TransitionProps as MuiTransitionProps } from "@mui/material/transitions";

export const ModalTransition: React.ForwardRefExoticComponent<
  Pick<TransitionProps, React.ReactText> & React.RefAttributes<any>
> = forwardRef(function ModalTransition(
  { children, ...props }: TransitionProps,
  ref: React.Ref<any>
) {
  const theme = useTheme();

  if (!children) return null;

  const isFullScreenDialog = (
    Array.isArray(children) ? children[0] : children
  ).props?.children?.props?.className?.includes("MuiDialog-paperFullScreen");

  if (isFullScreenDialog)
    return (
      <Slide direction="up" appear {...props}>
        {children as any}
      </Slide>
    );

  const defaultStyle = {
    opacity: 0,
    transform: "scale(0.8)",

    transition: theme.transitions.create(["transform", "opacity"], {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.strong,
    }),
  };

  const transitionStyles = {
    entering: {
      willChange: "transform, opacity",
    },

    entered: {
      opacity: 1,
      transform: "none",
    },

    exiting: {
      opacity: 0,
      transform: "scale(0.8)",

      transitionDuration: theme.transitions.duration.leavingScreen,
    },

    exited: {
      opacity: 0,
      transform: "none",
      transition: "none",
    },

    unmounted: {},
  };

  return (
    <Transition
      appear
      timeout={{
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
      }}
      {...props}
    >
      {(state) =>
        cloneElement(children as any, {
          style: { ...defaultStyle, ...transitionStyles[state] },
          tabIndex: -1,
          ref,
        })
      }
    </Transition>
  );
});

export default ModalTransition;

export const ModalTransitionMui = forwardRef(function Transition(
  props: MuiTransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <ModalTransition ref={ref} {...props} />;
});
