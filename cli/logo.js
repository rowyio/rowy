const chalk = require("chalk");
const figlet = require("figlet");

const logo = `tttttttttttttttttttttttttttttttttttttttt
tttttttttttttttttttttttttttttttttttttttt
tttttttttttttttttttttttt            tttt
tttttttttttttttttttttttt     A      tttt
tttttttttttttttttttttttt   AA AA    tttt
tttttttttttttttttttttttt  AA   AA   tttt
tttttttttttttttttttttttt AAA   AAA  tttt
tttttttttttttt                      tttt
tttttttttttttt  tttttttt  ttttttt   tttt
tttttttttttttt  tttttttt  ttttttt   tttt
tttttttttttttt  tttttttt  ttttttt   tttt
tttt                                tttt
tttt   ttttttt  tttttttt  ttttttt   tttt
tttt   ttttttt  tttttttt  ttttttt   tttt
tttt   ttttttt  tttttttt  ttttttt   tttt
tttt                                tttt
tttttttttttttttttttttttttttttttttttttttt
tttttttttttttttttttttttttttttttttttttttt`;

const logo1 = `++++++++++++++++++++++++++++++++++++++++
++++++++++++++++++++++++++++++++++++++++
++++++++++++++++++++++++            ++++
++++++++++++++++++++++++     A      ++++
++++++++++++++++++++++++   AA AA    ++++
++++++++++++++++++++++++  AA   AA   ++++
++++++++++++++++++++++++ AAA   AAA  ++++
++++++++++++++                      ++++
++++++++++++++  ++++++++  +++++++   ++++
++++++++++++++  ++++++++  +++++++   ++++
++++++++++++++  ++++++++  +++++++   ++++
++++                                ++++
++++   +++++++  ++++++++  +++++++   ++++
++++   +++++++  ++++++++  +++++++   ++++
++++   +++++++  ++++++++  +++++++   ++++
++++                                ++++
++++++++++++++++++++++++++++++++++++++++
++++++++++++++++++++++++++++++++++++++++`;

module.exports.printLogo = () => {
  console.log(chalk.red(logo1));
  try {
    console.log(
      chalk.white(
        figlet.textSync("FIRETABLE", {
          font: "rounded",
          horizontalLayout: "full",
        })
      )
    );
  } catch (err) {
    console.log("FIRETABLE");
  }
};
