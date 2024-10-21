import React from 'react';
import './CombiToolTip.css';

const CombiTooltip: React.FC<{ description: string, imageUrls: string[] }> = ({ description, imageUrls }) => {
    return (
        <div className="combi-tooltip">
            <div className="tooltip-content">
            {imageUrls && imageUrls.length > 0 && (
                    <div className="tooltip-images">
                        {imageUrls.map((url, index) => (
                            <img key={index} src={url} alt={`Combi illustration ${index}`} />
                        ))}
                    </div>
                )}
                <div className="tooltip-text">
                    <p>{description}</p>
                </div>
                {/* Affiche les images à côté du texte */}
            </div>
        </div>
    );
};

export default CombiTooltip;
