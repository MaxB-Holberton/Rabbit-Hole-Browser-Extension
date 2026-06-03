import React from 'react';

export function IconButton({ iconSrc, label, showLabel = true, ariaLabel, className = '', ...props }) {
	const buttonClassName = ['iconButton', className].filter(Boolean).join(' ');
	const accessibleLabel = ariaLabel || label;

	return (
		<button type="button" className={buttonClassName} aria-label={accessibleLabel} {...props}>
			<img src={iconSrc} alt="" aria-hidden="true" className="iconButtonIcon" />
			{showLabel ? <span className="iconButtonLabel">{label}</span> : null}
		</button>
	);
}