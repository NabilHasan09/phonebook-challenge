import { useEffect, useMemo, useState } from "react";

import "./App.css";

const FALLBACK_CONTACTS = [{
        id: 1,
        name: "Nabil Hasan",
        phone: "(555) 010-0101",
        email: "nabil@example.com"
    },
    {
        id: 2,
        name: "Gregory Tomchuk",
        phone: "(555) 010-0102",
        email: "gregory@example.com"
    },
    {
        id: 3,
        name: "Hasib Shaif",
        phone: "(555) 010-0103",
        email: "hasib@example.com"
    }
];



const App = () => {
    const [contacts, setContacts] = useState(FALLBACK_CONTACTS);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [inputError, setInputError] = useState('');
    

    useEffect(() => {

        const getContacts = async () => {
            try {
                const res = await fetch('public/data/contacts.json')
                const data = await res.json();  
                setContacts(data);
            }catch (err) {
                setError(err.message);
                setContacts(FALLBACK_CONTACTS);
            } finally {
                setLoading(false);
            }
        }

        setLoading(true);
        getContacts();

    }, []);

    const [query, setQuery] = useState("");


    const filteredContacts = () => {
        if (!query) {
            return contacts;
        }
        return contacts.filter((contact) =>
            contact.name.toLowerCase().includes(query.toLowerCase()) ||
            contact.phone.includes(query)
        );
    };  

    const validateForm = () => {
        if (form.name.trim().length < 2 || !form.phone.trim() || form.email.trim().includes('@') === false) {
            setInputError('Name must be at least 2 characters, Phone is required, and Email must be valid');
            return false;
        }

        return true;
    }

    const [form, setForm] = useState({ name: "", phone: "", email: "" });
    
    function handleSubmit(e) {

        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setInputError('');

        const addContact = {
            id: contacts.length + 1,
            name: form.name,
            phone: form.phone,
            email: form.email
        };

        setContacts([addContact, ...contacts]);
        setForm({ name: "", phone: "", email: "" });

    }

    return (
        <main className="page" data-testid="page-root">
            <header className="page__header">
                <h1 className="page__title">Phonebook Challenge</h1>
                <p className="page__subtitle">Build a simple contact directory</p>
            </header>

            <section className="search" aria-labelledby="search-heading">
                <h2 id="search-heading">Search Contacts</h2>
                <div className="search__controls">
                    <label htmlFor="search-input">Search</label>
                    <input
                        id="search-input"
                        type="search"
                        placeholder="Search by name or phone"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        data-testid="search-input"
                    />
                </div>

                <p className="search__results" data-testid="results-count">
                    Showing {filteredContacts().length}{" "}
                    {filteredContacts().length === 1 ? "result" : "results"}
                    {loading ? " (loading...)" : ""}
                    {error ? ` (error: ${error})` : ""}
                </p>
            </section>

            <section className="contacts" aria-labelledby="contacts-heading">
                <h2 id="contacts-heading">Contacts</h2>
                    <ul className="contacts__grid">
                        {filteredContacts().map((contact) => (
                            <li key={contact.id} className="contact-card" >
                                <h4 className="contact-card__name">{contact.name}</h4>
                                <p className="contact-card__phone">{contact.phone}</p>
                                <p className="contact-card__email">{contact.email}</p>
                            </li>
                        ))}
                    </ul>
                
            </section>

            <section className="form" aria-labelledby="form-heading">
                <h2 id="form-heading">Add a Contact</h2>
                <form className="form__body"  noValidate>
                    <div className="field">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            minLength={2}
                            className={inputError ? 'error__message' : ''}
                        /> 
                            
                    </div>
                    <div className="field">
                        <label htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            name="phone"
                            inputMode="tel"
                            placeholder="(555) 555-5555"
                            value={form.phone}
                            onChange={(e) =>
                                setForm({ ...form, phone: e.target.value })
                            }
                            required
                            className={inputError ? 'error__message' : ''}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            className={inputError ? 'error__message' : ''}
                        />
                    </div>
                    <div className="form__actions">
                        <button className="btn" type="submit" data-testid="btn-add" onClick={(e) => handleSubmit(e)}>
                            Add Contact
                        </button>
                    </div>
                </form>
            </section>

            <footer className="page__footer">
                <small>
                    {inputError && <span className="error__message_text" >{inputError} </span>}
                </small>
            </footer>
        </main>
    );
};

export default App;
