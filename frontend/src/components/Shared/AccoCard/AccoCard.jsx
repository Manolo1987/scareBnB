import styles from './AccoCard.module.css';
import { Link } from 'react-router-dom';
import FavouriteIcon from '../FavouriteIcon/FavouriteIcon';
import { useAuth } from '../../../context/UserAuthContext';
import { Ghost, DoorOpen, LockKey } from '@phosphor-icons/react';

export default function AccoCard(acco) {
  const { isAuthenticated } = useAuth();
  return (
    <Link to={`/accommodation`} className={styles.cardLink}>
      {' '}
      {/* /${acco.id} */}
      <div className={styles.accoCardContainer}>
        <div className={styles.info_container}>
          <h4>
            {acco.acco.title}{' '}
            {isAuthenticated && <FavouriteIcon accoId={acco.acco._id} />}
          </h4>
          <span>{acco.acco.city}</span>
        </div>
        <div className={styles.img_container}>
          <img src={acco?.acco.titleImage.secure_url} alt='location-preview' />
        </div>
        <div className={styles.info_container}>
          <p
            title={`rating: ${acco.acco.rating.toFixed(1)} spooks`}
            className={styles.rating}
          >
            <Ghost
              className={styles.ghost}
              weight='fill'
              size={24}
              color='white'
            />{' '}
            {acco.acco.rating.toFixed(1)}{' '}
          </p>
          <p>Bedrooms: {acco.acco.bedrooms} </p>
          <p>Price per Night: {acco.acco.pricePerNight}€</p>
          <p>
            Availability:{' '}
            {acco.acco.isBooked ? (
              <>
                Close <LockKey size={20} color='white' />
              </>
            ) : (
              <>
                Open <DoorOpen size={20} color='white' />
              </>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
}
