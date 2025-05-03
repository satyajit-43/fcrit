import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

function Contact() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);

    emailjs.send('service_0efzx8m', 'template_3ref3vd', {
      email,
      subject,
      message,
    }, 'Tew9A-B-c5W2S7CYH')
      .then(() => {
        setIsSending(false);
        setIsSent(true);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        setIsSending(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'subject') {
      setSubject(value);
    } else if (name === 'message') {
      setMessage(value);
    }
  };

  return (
    <section className="bg-white dark:bg-white">
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md border-black border-[2px] rounded-xl m-10">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-black">Contact Us</h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-black sm:text-xl">If you are facing any problem or if you have any querie, Let us know.</p>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Your email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
              placeholder="name@flowbite.com"
              required
            />
          </div>
          <div>
            <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={subject}
              onChange={handleInputChange}
              className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
              placeholder="Let us know how we can help you"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Your message</label>
            <textarea
              id="message"
              name="message"
              rows="6"
              value={message}
              onChange={handleInputChange}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Leave a comment..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="text-sm font-medium text-center text-white rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 py-3 px-5"
            disabled={isSending || isSent}
          >
            {isSending ? 'Sending...' : isSent ? 'Sent!' : 'Send message'}
          </button>
        </form>
      </div>
    </section>
  );
}

export { Contact };
