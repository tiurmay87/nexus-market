/**
 * StarRating — renders 5 stars filled up to the given rating
 * @param {number} rating - e.g. 4.8
 */
function StarRating({ rating }) {
  return React.createElement(
    'span',
    null,
    [1, 2, 3, 4, 5].map((i) =>
      React.createElement(
        'span',
        {
          key: i,
          style: { color: i <= Math.round(rating) ? '#F59E0B' : '#D1D5DB', fontSize: '14px' },
        },
        '★'
      )
    )
  );
}
