import { forwardRef, cloneElement } from "react";
import { useTheme } from "@mui/material";
import { Transition } from "react-transition-group";
import { TransitionProps } from "react-transition-group/Transition";
import { TransitionProps as MuiTransitionProps } from "@mui/material/transitions";

export const FadeTransition: React.ForwardRefExoticComponent<
  Pick<TransitionProps, React.ReactText> & React.RefAttributes<any>
> = forwardRef(
  ({ children, ...props }: TransitionProps, ref: React.Ref<any>) => {
    const theme = useTheme();

    if (!children) return null;

    const defaultStyle = {
      opacity: 0,
      transform: "scale(0.8)",

      transition: theme.transitions.create(["transform", "opacity"], {
        duration: "300ms",
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
        timeout={{ enter: 0, exit: theme.transitions.duration.leavingScreen }}
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
  }
);

export default FadeTransition;

export const FadeTransitionMui = forwardRef(function Transition(
  props: MuiTransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <FadeTransition ref={ref} {...props} />;
});
