import React from 'react';
import PropTypes from 'prop-types';

const BAL = props => {
  const { size } = props;
  return (
    <svg
      width={size}
      height={size}
      preserveAspectRatio="xMidYMid slice"
      clipRule="evenodd"
      fillRule="evenodd"
      viewBox="0 0 560 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m259.782 326.296c-30.081 0-58.241-10.88-77.228-30.081-17.067-17.067-26.027-40.107-26.24-66.561l-8.533 1.493-.427-1.493c-.213-1.067-6.187-27.094 22.4-50.134-7.68-17.92-14.934-50.774 14.934-76.161 3.2-3.2 5.333-4.48 6.827-5.76.853-.64 1.493-1.067 2.133-1.493 1.707-4.693 5.12-8.96 6.827-10.667 9.387-9.814 21.334-11.307 21.76-11.52 1.707-.213 3.413-.427 5.12-.427 9.173 0 14.507 3.84 16.854 5.547.213.213.213.213.427.213 1.067.213 2.347.427 4.053.427 1.707 0 4.053.213 7.04.427 16.854 2.133 31.147 10.027 42.667 23.04 3.84-.427 19.2-2.56 26.88-4.267l11.734-2.56c18.774-4.053 36.481-7.893 49.281-7.893 1.92 0 3.627 0 5.12.213h.213c9.173 1.707 16.214 6.613 19.2 13.867 6.4 15.36 2.347 27.307-13.867 40.321-19.414 15.574-47.147 23.68-62.934 27.307.213 1.28.64 3.627 1.707 7.467 3.84-.427 7.893-.427 11.734-.427 31.574 0 51.841 11.52 53.121 22.827.213 3.84-2.56 8.32-9.173 10.24-28.374 7.467-34.134 21.334-41.601 53.761-4.48 19.2-15.787 35.201-33.281 46.294-15.574 10.454-35.841 16-56.748 16"
        fill="#df4601"
      />
      <path
        d="m227.354 75.199c9.387 0 14.72 4.48 16.64 5.76 2.56.853 5.333.213 11.52 1.067 10.667 1.493 27.52 5.973 42.241 23.254 0 0 18.987-2.56 27.947-4.267 22.614-4.693 45.441-10.24 60.588-10.24 1.707 0 3.413 0 4.907.213 9.6 1.707 15.574 7.04 17.92 13.014 6.613 15.787 1.28 26.667-13.227 38.401-18.134 14.507-44.587 23.04-63.574 27.52 0 0 .213 2.987 2.347 10.454 4.48-.427 8.747-.64 12.8-.64 30.721 0 50.348 11.094 51.414 21.334.213 2.987-2.133 6.827-8.107 8.533-29.227 7.68-35.414 22.4-42.881 55.041-9.173 40.107-48.001 60.588-88.322 60.588-50.134 0-102.188-31.574-101.975-96.855l-8.96 1.493s-6.4-26.454 22.827-49.281c-5.333-11.947-18.56-47.787 13.867-75.308 5.12-4.907 7.04-5.547 9.387-7.467 1.493-4.48 4.693-8.747 6.613-10.454 9.173-9.387 20.694-10.88 20.694-10.88 2.133-1.067 3.84-1.28 5.333-1.28m0-3.2c-1.707 0-3.627.213-5.333.427-1.067.213-13.014 1.92-22.614 11.947-1.707 1.707-5.12 5.973-7.04 10.88-.427.427-1.067.853-1.707 1.28-1.707 1.067-3.627 2.56-7.04 5.76-14.72 12.374-22.187 27.734-22.187 45.867 0 9.814 2.133 20.267 6.4 30.934-14.507 11.947-19.84 24.534-21.76 33.494-2.133 10.027-.427 17.28-.427 17.494l.64 2.987 2.987-.427 5.333-.853c.64 26.027 9.814 48.641 26.88 65.708 19.414 19.414 48.001 30.507 78.295 30.507 21.12 0 41.601-5.547 57.601-15.787 17.707-11.307 29.441-27.734 33.921-47.361 7.467-32.427 12.8-45.441 40.321-52.481 7.68-2.133 10.88-7.467 10.454-11.947-.64-6.4-6.827-12.587-16.64-17.067-7.04-3.2-19.627-7.04-38.187-7.04-3.413 0-6.827.213-10.454.427-.427-1.92-.853-3.2-1.067-4.48 16.214-3.84 42.881-12.16 61.868-27.307 16.854-13.44 21.12-26.027 14.294-42.241-3.2-7.68-10.667-13.227-20.48-14.934h-.427c-1.707-.213-3.413-.213-5.333-.213-13.014 0-30.721 3.84-49.494 7.893l-11.734 2.56c-7.253 1.493-21.12 3.413-25.814 4.053-11.094-13.44-25.6-21.12-42.667-23.467-2.987-.427-5.333-.427-7.253-.427-1.493 0-2.56 0-3.413-.213 0 0-.213 0-.213-.213-2.347-1.707-8.107-5.76-17.707-5.76"
        fill="#fff"
      />
      <path d="m361.11 200.641c-31.574 17.494-29.441 40.107-64.854 49.494-40.107 10.454-72.535-16.427-49.068-21.76 5.547-1.067 6.187-4.48.213-3.413-14.08.853-32.214 8.107-15.147 36.267 0 0 2.347 1.067 3.413 0 0 0-6.4-14.294-1.493-18.347 22.614 21.547 72.961 25.387 104.535-16.64 10.667-14.08 23.04-22.187 34.987-27.094-19.2-4.693-40.961-5.12-52.908-1.493-1.493-18.987-2.56-24.32-6.187-32.427-1.707-3.627-1.92-5.76 6.4-8.107 5.12-1.493 26.454-6.4 44.801-14.72 13.014-5.973 21.974-12.587 24.32-14.934 1.92-1.707 8.747-9.387 6.187-15.574s-8.747-6.613-16.214-5.973c-6.4.64-9.387.853-49.281 9.6-20.907 4.267-32.854 4.48-40.321 6.827 0 0-9.814-23.894-42.454-24.96-4.267 0-11.094-.853-14.507-4.267-3.627-2.773-10.027-2.347-15.36.64-4.053 2.133-7.467 5.547-8.107 8.747-1.493 5.547-3.413 5.12-11.094 11.52-9.6 7.893-31.574 25.387-7.253 69.975-22.187 12.8-25.387 27.734-25.387 27.734l10.24-.64c-1.493 2.773-2.773 11.947-2.773 16-.213 23.254 6.827 42.454 21.12 56.961 15.574 15.787 39.254 24.96 64.428 24.96 17.707 0 34.774-4.693 48.001-13.014 5.973-3.84 11.307-8.533 15.36-13.867-50.774 31.574-97.282 4.693-106.669-22.187-9.173-26.24 7.253-46.507 28.16-41.601 29.227 7.04 44.587 2.987 49.068-11.094 3.627 1.28 11.947 1.067 17.067-1.493 7.68-3.413 25.387-9.814 50.774-5.12" />
      <path
        d="m295.098 161.329c-.9-.055-1.794.032-2.673.271-7.04 1.92-10.24 12.8-7.467 24.32 3.2 11.52 11.307 19.412 18.347 17.492s10.24-12.802 7.253-24.32c-2.613-10.08-9.15-17.381-15.458-17.762h-.002zm-72.65 6.671c-17.28 8.107-33.921 10.025-33.921 10.025l2.987 6.187 30.934-16.211zm42.804 5.116c-.915-.002-1.815.137-2.697.429-6.827 2.133-9.389 13.227-5.762 24.534s12.374 18.776 19.2 16.429c6.827-2.133 9.389-13.227 5.762-24.534-3.172-9.892-10.104-16.847-16.504-16.858z"
        fill="#fff"
      />
      <path d="m288.141 178.304c-.439.058-.864.175-1.263.363-3.413 1.707-4.056 7.038-1.709 11.945 2.347 5.12 7.042 7.682 10.242 6.189 3.413-1.707 4.051-7.04 1.705-11.947-2.054-4.294-5.901-6.953-8.975-6.549zm-27.245 10.187c-1.007-.053-1.963.149-2.816.629-3.413 1.92-4.053 7.891-1.067 13.011 2.987 5.12 8.103 7.896 11.516 5.976s4.053-7.896 1.067-13.016c-2.24-4-5.679-6.441-8.7-6.601z" />
      <path
        d="m224.026 98.053c-3.134.119-6.419 2.093-8.192 8.719l16-5.973s-3.778-2.904-7.808-2.746zm31.7 7.012c-2.133.213-4.049 1.067-5.116 2.773-1.28 1.707-1.709 4.267-.855 6.4-1.92 4.693-1.709 10.238-.429 14.505 1.493 4.48 3.631 7.682 6.618 9.176 1.707 1.067 3.84 1.065 5.333.638 2.133-.64 3.625-2.133 4.691-4.48 2.347-4.907 1.918-12.16.211-17.067.853-.64 1.92-2.131 2.347-3.411l-1.491-.427c-.427.853-.851 1.707-1.491 2.347-2.56-7.04-6.191-10.667-9.818-10.454zm.218 3.2c2.56 0 4.902 4.907 6.183 9.173-1.92.853-3.411.853-4.905.213-1.707-.64-3.2-2.136-4.053-3.842-.64-1.493-.642-3.198.211-4.478.427-.64 1.498-1.067 2.564-1.067zm132.036 6.287c-3.52-.301-41.166 25.927-41.166 25.927 24.952-8.32 45.006-20.907 41.379-25.814-.041-.066-.122-.102-.235-.113h.021zm-16.197.753s-40.747 8.96-66.348 12.16c-27.52 3.2-52.054 22.187-52.054 22.187-10.454 6.827.215 6.825 16.429 8.958 24.96.64 40.745-4.691 62.292-17.492 19.84-13.867 39.681-25.814 39.681-25.814zm-100.693.213c-.213 0-.429.427-.642.853-.427.853-.64 2.131-.213 2.771 0 .213.427.213 1.067 0 .213 0 .427-.211.427-.425.427-.427.429-1.282.215-1.709-.213-.213-.427-.211-.853-.211 0-.427-.002-.64.211-1.28h-.211zm3.838 2.133-1.719 1.278c-.213.64-.431 1.92-.431 2.987l-.213 3.413c-.213 2.133-.636 3.84-1.702 4.48l-.429 1.92h.211c1.28-.64 2.136-1.92 2.776-4.053l.213-1.922.211-1.705v-.429l.218-1.705.211-1.278v-.218l.213.218c.427.64 1.707 1.707 2.347 2.133l.211.211h-.211c-2.133.853-2.56 2.349-2.133 2.989.213.427.64.853.853 1.067.427.213 1.069.209 1.709-.218 1.28-.64 2.131-2.131 1.705-3.625v-.213l-.213-.64c-.213-.64-.427-1.065-1.067-1.705l-1.495-1.286-.429-.425c-.427-.213-.638-.64-.638-1.067v-.213h-.215l.019.004zm-22.2 1.278c3.2 1.92 6.185 1.92 9.811 0 .64 2.347 1.28 5.549 1.28 8.109 0 2.133-.213 4.905-1.28 6.611-.64 1.067-1.278 1.491-2.345 1.705-3.413.64-6.4-4.476-7.467-8.316-.64-2.56-.64-5.549 0-8.109zm24.534 4.267h.211s0 .213.213.213c0 .64 0 1.282-.213 1.495-.213.427-.427.636-.853.849-.427.213-.853.002-1.067-.211-.427-.213-.427-.64-.213-1.067.213-.427.855-.853 1.922-1.28z"
        fill="#df4601"
      />
    </svg>
  );
};

BAL.propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

BAL.defaultProps = {
  size: '100'
};

export default BAL;
