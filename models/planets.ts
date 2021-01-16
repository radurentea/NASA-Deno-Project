import { join } from "https://deno.land/std/path/mod.ts";
import { parse } from "https://deno.land/std/encoding/csv.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";

import { pick } from "https://deno.land/x/lodash@4.17.15-es/lodash.js";

type Planet = Record <string, string>;

let planets : Array<Planet>;

async function loadPlanetData() {
  const path = join("data", "kepler_exoplanets_nasa.csv");

  const file = await Deno.open(path);
  const bufReader = new BufReader(file);
  
  const result = await parse(bufReader, {
    skipFirstRow: true,
    comment: "#",
  });

  // Close file resource id (rid) to avoid leaking resources.
  Deno.close(file.rid);

  const planets = (result as Array<Planet>).filter((planet) => {
    const planetaryRadius = Number(planet["koi_prad"]);
    const stellarRadius = Number(planet["koi_srad"]);
    const stellarMass = Number(planet["koi_smass"]);

    return planet["koi_disposition"] === "CONFIRMED" 
      && planetaryRadius > 0.5 && planetaryRadius < 1.5
      && stellarRadius > 0.99 && stellarRadius < 1.01
      && stellarMass > 0.78 && stellarMass < 1.04;
  });

  return planets.map((planet) => {
    return pick(planet, [
      "kepler_name",
      "koi_prad",
      "koi_smass",
      "koi_srad",
      "koi_count",
      "koi_steff"
    ]);
  })
}

planets = await loadPlanetData();
console.log(`${planets.length} habitable planets found!`)

export function getAllPlanets() {
  return planets;
}
