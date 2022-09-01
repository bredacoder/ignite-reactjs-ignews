import Head from 'next/head';
import { GetStaticProps } from 'next';
import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';

import styles from './styles.module.scss';

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Boas práticas para devs em início de carreira</strong>
            <p>As principais lições e dicas compiladas para quem está começando na programação ou migrando para a área.</p>
          </a>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Boas práticas para devs em início de carreira</strong>
            <p>As principais lições e dicas compiladas para quem está começando na programação ou migrando para a área.</p>
          </a>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Boas práticas para devs em início de carreira</strong>
            <p>As principais lições e dicas compiladas para quem está começando na programação ou migrando para a área.</p>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'publication')
  ], {
    fetch: ['publication.title', 'publication.content'],
    pageSize: 100,
  });

  console.log(response);

  return {
    props: {}
  }
}