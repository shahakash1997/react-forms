import React from 'react';
import PropTypes from 'prop-types';

const alertStyles = {
	danger: 'bg-red-100 text-red-700 border-red-400',
	success: 'bg-green-100 text-green-700 border-green-400',
	warning: 'bg-yellow-100 text-yellow-700 border-yellow-400',
	info: 'bg-blue-100 text-blue-700 border-blue-400',
};

const Errors = (props) => {
	const { type = 'danger', errors } = props;

	const hasErrors = (error) => {
		if (Array.isArray(error)) {
			return error.filter((item) => !!item).length !== 0;
		}

		return !!error;
	};

	/**
	 * @param {string|any[]} error
	 * @returns {string|unknown[]|*}
	 */
	const formatError = (error) => {
		if (typeof error === 'string') {
			return error;
		}

		if (Array.isArray(error)) {
			return error.map(formatError);
		}

		// eslint-disable-next-line no-prototype-builtins
		if (error.hasOwnProperty('errors')) {
			return Object.keys(error.errors).map((key, index) => {
				const item = error.errors[key];
				return (
					<div key={index}>
						<strong>
							{item.name} ({item.path})
						</strong>{' '}
						- {item.message}
					</div>
				);
			});
		}

		// If this is a standard error.
		// eslint-disable-next-line no-prototype-builtins
		if (error.hasOwnProperty('message')) {
			return error.message;
		}

		// If this is a joy validation error.
		// eslint-disable-next-line no-prototype-builtins
		if (error.hasOwnProperty('name') && error.name === 'ValidationError') {
			return error.details.map((item, index) => {
				return <div key={index}>{item.message}</div>;
			});
		}

		// If a conflict error occurs on a form, the form is returned.
		// eslint-disable-next-line no-prototype-builtins
		if (error.hasOwnProperty('_id') && error.hasOwnProperty('display')) {
			return 'Another user has saved this form already. Please reload and re-apply your changes.';
		}

		return 'An error occurred. See console logs for details.';
	};

	// If there are no errors, don't render anything.
	if (!hasErrors(errors)) {
		return null;
	}

	const typeClasses = alertStyles[type] || alertStyles.danger;

	return (
		<div
			className={`p-4 mb-4 rounded border text-sm ${typeClasses}`}
			role="alert"
		>
			{formatError(errors)}
		</div>
	);
};

Errors.propTypes = {
	errors: PropTypes.any,
	type: PropTypes.string,
};

export default Errors;
