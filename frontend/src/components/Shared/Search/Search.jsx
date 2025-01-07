import React, { useContext } from 'react';
import styles from './Search.module.css';
import { AccommodationContext } from '../../../context/AccommodationContext';


export default function Search() {
  const { setStateFilter } = useContext(AccommodationContext);

  const handleRegionChange = (event) => {
    const selectedRegion = event.target.value;
    setStateFilter(selectedRegion);
    console.log('Selected Region:', selectedRegion);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className={styles.searchbar}>
      <form onSubmit={handleSubmit}>

        <select
          id="selection"
          onChange={handleRegionChange}
        >
          <option value="">Choose your final destination</option>
          <option value="Baden-Württemberg">Baden-Württemberg</option>
          <option value="Bayern">Bayern</option>
          <option value="Berlin">Berlin</option>
          <option value="Brandenburg">Brandenburg</option>
          <option value="Bremen">Bremen</option>
          <option value="Hamburg">Hamburg</option>
          <option value="Hessen">Hessen</option>
          <option value="Mecklenburg-Vorpommern">Mecklenburg-Vorpommern</option>
          <option value="Niedersachsen">Niedersachsen</option>
          <option value="Nordrhein-Westfalen">Nordrhein-Westfalen</option>
          <option value="Rheinland-Pfalz">Rheinland-Pfalz</option>
          <option value="Saarland">Saarland</option>
          <option value="Sachsen">Sachsen</option>
          <option value="Sachsen-Anhalt">Sachsen-Anhalt</option>
          <option value="Schleswig-Holstein">Schleswig-Holstein</option>
          <option value="Thüringen">Thüringen</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};