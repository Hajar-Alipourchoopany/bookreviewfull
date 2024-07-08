import React from 'react';
import "../ReviewItem.css";
const ReviewItem = ({ review, onFavorite }) => {
  return (
    <div className="review-item">
      <p>{review.review_text}</p>
      <span>{review.username}</span>
      <span>{review.rating} Stars</span>
      <button onClick={() => onFavorite(review._id)}>❤️</button>
    </div>
  );
};

export default ReviewItem;
