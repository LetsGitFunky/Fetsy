import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reviewActions from '../../../store/review.js';
import { Modal } from '../../../context/Modal.js'
import './ReviewForm.css'
import ReviewStarRating from '../Ratings/ReviewStarRating.js';

const ReviewForm = ({productId, onReviewSubmit }) => {

    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [rating, setRating] = useState(3);
    const currentUser = useSelector(state => state.session.user);
    const [submissionSuccessful, setSubmissionSuccessful] = useState(false);

    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(reviewActions.createReview(productId, { userId: currentUser.id, title, body, rating, productId }))
        .then(() => {
            setTitle('');
            setBody('');
            setRating(3);
            setShowModal(false);
            setSubmissionSuccessful(true);
            setTimeout(() => setSubmissionSuccessful(false), 5000);
            onReviewSubmit();
            // debugger
        })
        .catch(async (res) => {
            let data;
            try {
            data = await res.json();
            } catch {
            data = await res.text();
            }
            if (data?.errors) setErrors(data.errors);
            else if (data) setErrors([data]);
            else setErrors([res.statusText]);
        });
    }



    return (
        <div>
            {submissionSuccessful && <p>Review submitted successfully!</p>}

            <button className="new-review-button" onClick={() => setShowModal(true)}>Write a Review</button>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                {/* <div className=''> */}
                    <form className="review-form" onSubmit={handleSubmit}>
                        <ul className="error-list">
                            {errors.map((error, index) => <li key={index}>{error}</li>)}
                        </ul>
                        <h1 className='review-form-header'>Write a review</h1>
                        <div className='review-title-container'>
                            <label className="review-input-label">
                                Title
                                <input
                                    className="review-form-input"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                        <div className='review-body-container'>
                            <label className="review-input-label">
                                Body
                                <textarea
                                    className="review-form-input"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                        <div className='review-rating-container'>
                            <label className="review-input-label">
                                Rating
                                <ReviewStarRating onRatingChange={(newRating) => setRating(newRating)} />
                                {/* <select
                                    className="review-form-input"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    required
                                >
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                </select> */}
                            </label>
                        </div>
                        <button className="review-form-button" type="submit">Submit Review</button>
                    </form>
                {/* </div> */}
                </Modal>
            )}
        </div>
    )
}

export default ReviewForm;
