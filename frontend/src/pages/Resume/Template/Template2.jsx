import React from 'react';
import './style2.scss';
const Resume = ({ data }) => {
    function formatMonthYear(monthYear) {
        if (!monthYear) return "";
        const [year, month] = monthYear.split("-");
        const date = new Date(year, month - 1);
        const options = { year: "numeric", month: "short" };
        return date.toLocaleDateString("en-US", options);
    } 
    const getLevelLabel = (rating) => {
        switch (rating) {
            case 1: return "Novice";
            case 2: return "Beginner";
            case 3: return "Skillful";
            case 4: return "Experienced";
            case 5: return "Expert";
            default: return "Unknown";
        }
    };
    return (
        <div className='t1'>
            <div className="rela-block page">
                <link
                    href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600"
                    rel="stylesheet"
                    type="text/css"
                />
                <link
                    href="https://fonts.googleapis.com/css?family=Raleway:100"
                    rel="stylesheet"
                    type="text/css"
                />
                <link
                    href="https://fonts.googleapis.com/css?family=Montserrat"
                    rel="stylesheet"
                    type="text/css"
                />

                <div className="rela-block top-bar">
                    <div className="caps name">
                        <div className="abs-center">{data.firstName} {data.lastName}</div>
                    </div>
                </div>
                <div className="side-bar">
                    <div className="mugshot">
                        <div className="logo">
                            <svg viewBox="0 0 80 80" className="rela-block logo-svg">
                                <path
                                    d="M 10 10 L 52 10 L 72 30 L 72 70 L 30 70 L 10 50 Z"
                                    strokeWidth="2.5"
                                    fill="none"
                                />
                            </svg>
                            <p className="logo-text">kj</p>
                        </div>
                    </div>
                    <p>{data.address}</p>
                    <p>{data.city}, {data.country}</p>
                    <p>1-800-CALLPLZ</p>
                    <p>{data.email}</p>
                    <br />
                    <p className="rela-block social twitter">Twitter stuff</p>
                    <p className="rela-block social pinterest">Pinterest things</p>
                    <p className="rela-block social linked-in">Linked-in man</p>
                    <p className="rela-block caps side-header">Expertise</p>
                    <p className='list-thing'>
                        {data?.skills && data.skills.length > 0 ? (
                            data.skills.map((item, index) => (
                                <div key={index} className="mb-6">
                                    <h3 className="text-lg font-bold">
                                        {item.name || "(No specified skill)"} - {getLevelLabel(item.rating)}
                                    </h3>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No skills available.</p>
                        )}
                    </p>

                    <p className="rela-block caps side-header">Education</p>
                    {data?.education && data.education.length > 0 ? (
                                data.education.map((item, index) => (
                                    <div key={index} className="mb-6">
                                        <h3 className="rela-block list-thing">
                                            {item.degree} from {item.universityName}, {item.city}
                                        </h3>
                                        <div className="rela-block list-thing">
                                            {formatMonthYear(item.startDate)}—{formatMonthYear(item.endDate)}
                                        </div>
                                        {item.description && (
                                            <div
                                                className="mt-2 text-gray-700"
                                                dangerouslySetInnerHTML={{ __html: item.description }}
                                            />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No education history available.</p>
                            )}
               
                </div>
                <div className="rela-block content-container">
                    <h2 className="rela-block caps title">{data.jobTitle}</h2>
                    <div className="rela-block separator"></div>
                    <div className="rela-block caps greyed">Profile</div>
                    <p className="long-margin">
                        Retro DIY quinoa, mixtape williamsburg master cleanse bushwick tumblr
                        chillwave dreamcatcher hella wolf paleo. Knausgaard semiotics truffaut
                        cornhole hoodie, YOLO meggings gochujang tofu. Locavore ugh kale chips
                        iPhone biodiesel typewriter freegan, kinfolk brooklyn kitsch man bun.
                        Austin neutra etsy, lumbersexual paleo cornhole sriracha kinfolk
                        meggings kickstarter.
                    </p>
                    <div className="rela-block caps greyed">Experience</div>

                    <h3>Job #1</h3>
                    <p className="light">First job description</p>
                    <p className="justified">
                        
                    </p>

                    <h3>Job #2</h3>
                    <p className="light">Second Job Description</p>
                    <p className="justified">
                 
                    </p>

                    <h3>Job #3</h3>
                    <p className="light">Third Job Description</p>
                    <p className="justified">
                        Next level roof party lo-fi fingerstache skateboard, kogi tumblr.
                        Shabby chic put a bird on it chambray, 3 wolf moon swag beard brooklyn
                        post-ironic taxidermy art party microdosing keffiyeh marfa. Put a bird
                        on it 3 wolf moon cliche helvetica knausgaard. Mumblecore fingerstache
                        lomo, artisan freegan keffiyeh paleo kinfolk kale chips street art
                        blog flannel.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Resume;
