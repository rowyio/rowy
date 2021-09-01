const CracoSwcPlugin = require("craco-swc");

module.exports = {
	plugins: [
		{
			plugin: CracoSwcPlugin,
			options: {
				swcLoaderOptions: {
					jsc: {
						target: "es2019",
						transform: {
							react: {
								runtime: "automatic",
							},
						},
					},
				},
			},
		},
	],
};
