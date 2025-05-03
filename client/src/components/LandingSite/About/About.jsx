import { TeamCard } from "./TeamMember";
function About() {

  const gabriel = {
    name: "Gabriel",
    designation: "1022139",
    image:
      "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
  };
  const satyajit = {
    name: "Satyajit",
    designation: "1022143",
    image:
      "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
  };
  const sameep = {
    name: "Sameep",
    designation: "1022144",
    image:
      "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
  };
  const atharv = {
    name: "Atharv",
    designation: "1022147",
    image:
      "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
  };

  return (
    <>
      <h1 className="font-bold text-white text-center text-5xl">
        Meet Our Team!
      </h1>
      <div className="py-20 sm:py-25 flex gap-10 flex-wrap justify-center align-center">
        <TeamCard member={gabriel} />
        <TeamCard member={satyajit} />
        <TeamCard member={sameep} />
        <TeamCard member={atharv} />
      </div>
    </>
  );
}
export { About };
