const JOTAI_USE_ATOM_HOOKS = [
  "useAtom",
  "useSetAtom",
  "useAtomValue",
  "useUpdateAtom",
  "useAtomValue",
  "useResetAtom",
  "useReducerAtom",
  "useAtomCallback",
  "useHydrateAtoms",
];

module.exports = {
  "no-jotai-use-atom-without-scope": {
    meta: {
      hasSuggestions: true,
    },
    create: function (context) {
      return {
        CallExpression: function (node) {
          if (
            node.callee.name &&
            JOTAI_USE_ATOM_HOOKS.includes(node.callee.name)
          ) {
            const lastArgument =
              node.arguments[node.arguments.length - 1] || "";
            if (!lastArgument.name.match(/scope/i)) {
              context.report({
                node: node,
                message:
                  "Missing scope argument. Scope should be suffixed with -Scope",
                suggest: [
                  {
                    desc: "Set the scope to `globalScope`",
                    fix(fixer) {
                      return fixer.insertTextAfter(
                        lastArgument,
                        ", globalScope"
                      );
                    },
                  },
                  {
                    desc: "Set the scope to `tableScope`",
                    fix(fixer) {
                      return fixer.insertTextAfter(
                        lastArgument,
                        ", tableScope"
                      );
                    },
                  },
                ],
              });
            }
          }
        },
      };
    },
  },
};
