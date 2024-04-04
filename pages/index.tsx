import React from "react";
import Nav from "../components/Nav";

import { List } from "../utils/types";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import Image from "next/image";

interface IndexProps {
  lists: Array<List>;
}

function Index(props: IndexProps) {
  console.dir("App running!");

  const { lists } = props;

  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>
      <Nav />
      <main>
        <h1>Music Shelf v1</h1>
        <div className="itemsection"></div>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch(process.env.API_URL_LISTS as string);
  const lists = await res.json();

  return {
    props: { lists },
  };
}

export default Index;

export function Home() {
  console.dir("App running!");
}
