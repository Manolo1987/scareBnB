import styles from './AccoCard.module.css';
import { Link } from 'react-router-dom';
import FavouriteIcon from '../FavouriteIcon/FavouriteIcon';
import { useAuth } from '../../../context/UserAuthContext';
import { Ghost, DoorOpen, LockKey } from '@phosphor-icons/react';

export default function AccoCard({ acco }) {
  const { isAuthenticated } = useAuth();

  if (!acco) {
    console.error('No accommodation data provided');
    return null;
  }

  if (!acco.title || !acco._id) {
    console.error('Incomplete accommodation data', acco);
    return <div>Invalid accommodation data</div>;
  }

  return (
    <Link
      to={`/accommodationList/${acco.title
        .toLowerCase()
        .replace(/\s+/g, '-')}?id=${acco._id}`}
      state={{ id: acco._id }}
      className={styles.cardLink}
    >
      {' '}
      {/* /${acco.id} */}
      <div className={styles.accoCardContainer}>
        <div className={styles.info_container}>
          <h4>
            {acco.title}{' '}
            {isAuthenticated && <FavouriteIcon accoId={acco._id} />}
          </h4>
          <span>{acco.city}</span>
        </div>
        <div className={styles.img_container}>
          <img src={acco?.titleImage.secure_url} alt='location-preview' />
        </div>
        <div className={styles.info_container}>
          <p
            title={`rating: ${acco.rating.toFixed(1)} spooks`}
            className={styles.rating}
          >
            <Ghost
              className={styles.ghost}
              weight='fill'
              size={24}
              color='white'
            />{' '}
            {acco.rating.toFixed(1)}{' '}
          </p>
          <p>Bedrooms: {acco.bedrooms} </p>
          <p>Price per Night: {acco.pricePerNight}€</p>
          <p className={styles.center}>
            Availability:{' '}
            {acco.isBooked ? (
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
