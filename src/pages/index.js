
import Image from "next/image";
import Homecss from "@/styles/Home.module.css";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
export default function Home({ pokemonListo }) {


  const [pokemon, setPokemon] = useState(pokemonListo);
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
  }
  const filtrar = (tipo) => {

    if (tipo === "borrar") {
      setPokemon(pokemonListo);
    } else {
      let nuevoPokemon = pokemonListo.filter((pokemon) =>
        pokemon.types.includes(tipo)
      );
      setPokemon(nuevoPokemon);
    }
  };
  return (
    <>
      <div className={Homecss.botonestipo}>
        <button
          onClick={() => filtrar("borrar")}
          className={`${Homecss.botonFiltro} ${Homecss.botonesTodos}`}
        >
          Mostrar todos
        </button>
        <div className={Homecss.listadoTipos}>
          {/* {tipos.map((tipo, index) => (
            <button
              onClick={() => filtrar(tipo.name)}
              key={index}
              className={` ${Homecss.botonFiltro} ${tipo.name}`}
            >
              {tipo.name}
            </button>
          ))} */}
        </div>
      </div>
      <h1>Pokemones</h1>
      <motion.ul className={Homecss.columnas} variants={container} initial="hidden" animate="show">
        {pokemon.map((pokemon, index) => {
          return (
            <motion.li key={index} >
              <Link href={`pokemon/${pokemon.name}`}>
                <div className={`${Homecss.card} ${pokemon.types[0]}`}>
                  <div className={Homecss.nombreTipos}>
                    <h3>{pokemon.name}</h3>
                    <div className={Homecss.tipos}>
                      {pokemon.types.map((tipo, index) => {
                        return (
                          <p key={index} className={Homecss.tipo}>
                            {tipo}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                  <Image
                    src={pokemon.image}
                    alt=""
                    height={100}
                    width={100}
                    className={Homecss.imagen}
                  ></Image>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>
    </>
  );
}
export async function getStaticProps() {
  const tiposURl = await fetch("https://pokeapi.co/api/v2/type");
  const tipos = await tiposURl.json();

  const traerPokemon = async (numero) => {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${numero}?limit=250&offset=0.`
    );
    return await res.json();
  };

  let arrayPokemon = [];
  for (let index = 1; index <= 250; index++) {
    let data = await traerPokemon(index);
    arrayPokemon.push(data);
  }

  let pokemonListo = arrayPokemon.map((pokemon) => {
    return {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.sprites.other.dream_world.front_default,
      types: pokemon.types.map((type) => type.type.name),
    };
  });

  return {
    props: {
      pokemonListo,
   
    },
  };
}

