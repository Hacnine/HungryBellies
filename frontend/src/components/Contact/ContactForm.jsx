import React, { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [status, setStatus] = useState({
        submitted: false,
        success: false,
        error: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("https://formspree.io/f/xgegevnr", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus({ submitted: true, success: true, error: false });
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                });
            } else {
                setStatus({ submitted: true, success: false, error: true });
            }
        } catch (error) {
            setStatus({ submitted: true, success: false, error: true });
        }
    };

    return (
        <section className="bg-slate-900 py-8 shadow-md mb-12  ">
            <div className="container wrapper">
            <h2 className="text-2xl mb-6 text-white">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6 ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        className={`input-contact ${formData.name ? 'bg-[#e8f0ff]' : 'bg-transparent'}`}
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        className={`input-contact ${formData.email ? 'bg-[#e8f0ff]' : 'bg-transparent'}`}
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    className={`input-contact ${formData.subject ? 'bg-[#e8f0ff]' : 'bg-transparent'}`}
                    value={formData.subject}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="message"
                    rows="6"
                    placeholder="Message"
                    className={`w-full input-contact ${formData.message ? 'bg-[#e8f0ff]' : 'bg-transparent'}`}
                    value={formData.message}
                    onChange={handleChange}
                    required
                ></textarea>
                <button type="submit" className="bg-yellow-500 text-white py-3 px-6 shadow-md hover:bg-customred transition duration-300">
                    Send Message
                </button>
            </form>

            {status.submitted && status.success && (
                <p className="mt-4 text-green-500">Message sent successfully!</p>
            )}
            {status.submitted && status.error && (
                <p className="mt-4 text-red-500">Oops! Something went wrong. Please try again.</p>
            )}
            </div>
        </section>
    );
};

export default ContactForm;
