import React, { useEffect } from 'react';
import styles from './HomePage.module.css';
import AccoCard from '../../components/Shared/AccoCard/AccoCard';
import { Link } from 'react-router-dom';
import { useAcco } from '../../context/AccommodationContext';
import Search from '../../components/Shared/Search/Search.jsx';
import { DiamondsFour } from '@phosphor-icons/react';

export default function HomePage() {
  const { specialAccos, getSpecial } = useAcco();

  useEffect(() => {
    getSpecial();
  }, []);

  return (
    <>
      <Search />
      <div className={styles.homepage}>
        <section className={styles.intro_textArea}>
          <h3 className={styles.intro_title} >Welcome to ScareBnB – Where Fear Finds a Home</h3>

          <div className={styles.lineBreak} >
            <hr />
            <DiamondsFour size={20} />
            <hr />
          </div>

          <p>
            Looking for a stay that sends shivers down your spine? ScareBnB
            offers more than just a place to rest – it’s a portal to the
            unknown. From haunted mansions and cursed cabins to eerie crypts and
            shadowy castles, each property promises an unforgettable experience…
            if you dare.
          </p>
          <p>
            Ready to check in? Just remember... there's no guarantee you'll be
            able to check out.
          </p>
        </section>
        <section className={styles.highlight_section}>
          <h3 className={styles.highlight_header}>Our Most Haunted Stays</h3>
          <div className={styles.acco_highlights}>
            {specialAccos?.map((acco, index) => (
              <div
                key={acco.id || index}
                className={`${styles.card} ${styles[`card_${index + 1}`]}`}
              >
                <AccoCard acco={acco} />
              </div>
            ))}
          </div>
          <div className={styles.highlight_bottom}>
            <p>Stay Here… If You Dare</p>
            <Link to='/accommodationlist'>
              <button className="buttonEffect">See All Chilling Options</button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
