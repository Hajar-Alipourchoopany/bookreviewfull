import models from '../model/schema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import axios from 'axios';
const { User, Review, Book } = models;

// Benutzerregistrierung
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const profileImageUrl = req.file ? req.file.path : req.body.profileImageUrl;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Alle Felder sind erforderlich' });
    }

    // Überprüfen, ob der Benutzer existiert
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Benutzer mit dieser E-Mail existiert bereits' });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 12);

    // Neuen Benutzer erstellen
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profileImageUrl,
    });

    await newUser.save();

    // JWT Token erstellen
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Benutzerlogin
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Ungültige Anmeldedaten' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Ungültige Anmeldedaten' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('token', token, { maxAge: 3600000 }); // 1 hour

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Benutzer ausloggen
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: 'Benutzer erfolgreich ausgeloggt.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bewertungen eines Benutzers anzeigen
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate({
      path: 'reviews.review_id',
      populate: {
        path: 'book_id',
        select: 'title',
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
    }

    const reviews = user.reviews.map((review) => ({
      _id: review.review_id._id,
      bookTitle: review.review_id.book_id.title,
      review_text: review.review_id.review_text,
      rating: review.review_id.rating,
    }));

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Top-Reviewer anzeigen
export const getTopReviewer = async (req, res) => {
  try {
    const reviewers = await User.aggregate([
      {
        $project: {
          username: 1,
          profileImageUrl: 1,
          reviewCount: { $size: '$reviews' },
        },
      },
      {
        $match: {
          reviewCount: { $gt: 0 },
        },
      },
      {
        $sort: { reviewCount: -1 },
      },
    ]);

    res.status(200).json({ reviewers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.params.userId;
    const profileImageUrl = req.file ? req.file.path : null;

    if (!profileImageUrl) {
      return res.status(400).json({ message: 'Profilbild ist erforderlich' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImageUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    res.status(200).json({ profileImageUrl: user.profileImageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
