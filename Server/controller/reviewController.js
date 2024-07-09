import models from '../model/schema.js';
const { User, Review, Book } = models;

// Fetch reviews by ISBN
export const getReviewsByISBN = async (req, res) => {
  try {
    const { isbn } = req.params;
    const reviews = await Review.find({ isbn }).populate(
      'user_id',
      'username profileImageUrl'
    );
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a review
export const addReview = async (req, res) => {
  try {
    const { isbn, review_text, user_id, rating } = req.body;

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
    }

    const book = await Book.findOne({ isbn });
    if (!book) {
      return res.status(404).json({ message: 'Buch nicht gefunden.' });
    }

    const review = new Review({
      isbn,
      review_text,
      user_id,
      username: user.username,
      rating,
      book_id: book._id,
    });
    await review.save();

    user.reviews.push({ review_id: review._id });
    await user.save();

    res
      .status(201)
      .json({ message: 'Rezension erfolgreich hinzugefügt.', review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.body.user_id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Rezension nicht gefunden.' });
    }

    // Check if the review belongs to the user
    if (review.user_id.toString() !== userId) {
      return res.status(403).json({
        message: 'Sie haben keine Berechtigung, diese Rezension zu löschen.',
      });
    }

    await review.remove();

    // Remove the review from the user's document
    await User.updateOne(
      { _id: userId },
      { $pull: { reviews: { review_id: reviewId } } }
    );

    res.status(200).json({ message: 'Rezension erfolgreich gelöscht.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
