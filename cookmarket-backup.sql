--
-- PostgreSQL database dump
--

\restrict R4toGZqcw2IJPFSGFAy1gspPuB4agWIDZlad7GtY7xAujGAV5oPqsSAGs1EgfFy

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'PREPARING',
    'READY',
    'DELIVERING',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'CLIENT',
    'SELLER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL,
    type text DEFAULT 'BOTH'::text NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Category_id_seq" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: Comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Comment" (
    id integer NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" integer NOT NULL,
    "recipeId" integer NOT NULL
);


ALTER TABLE public."Comment" OWNER TO postgres;

--
-- Name: Comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Comment_id_seq" OWNER TO postgres;

--
-- Name: Comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Comment_id_seq" OWNED BY public."Comment".id;


--
-- Name: Dish; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Dish" (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    price double precision NOT NULL,
    "imageUrl" text,
    quantity integer DEFAULT 1 NOT NULL,
    availability boolean DEFAULT true NOT NULL,
    "preparationTime" integer,
    city text NOT NULL,
    allergens text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "sellerId" integer NOT NULL,
    "categoryId" integer
);


ALTER TABLE public."Dish" OWNER TO postgres;

--
-- Name: Dish_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Dish_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Dish_id_seq" OWNER TO postgres;

--
-- Name: Dish_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Dish_id_seq" OWNED BY public."Dish".id;


--
-- Name: Formation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Formation" (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    price double precision NOT NULL,
    duration text,
    level text,
    "imageUrl" text,
    availability boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "sellerId" integer NOT NULL
);


ALTER TABLE public."Formation" OWNER TO postgres;

--
-- Name: Formation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Formation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Formation_id_seq" OWNER TO postgres;

--
-- Name: Formation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Formation_id_seq" OWNED BY public."Formation".id;


--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id integer NOT NULL,
    "totalPrice" double precision NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "deliveryAddress" text NOT NULL,
    "paymentMethod" text DEFAULT 'CASH_ON_DELIVERY'::text NOT NULL,
    "paymentStatus" text DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "clientId" integer NOT NULL,
    "customerFirstName" text DEFAULT ''::text NOT NULL,
    "customerLastName" text DEFAULT ''::text NOT NULL,
    "customerEmail" text DEFAULT ''::text NOT NULL,
    "customerPhone" text DEFAULT ''::text NOT NULL,
    "deliveryCity" text DEFAULT ''::text NOT NULL,
    "deliveryFee" double precision DEFAULT 7 NOT NULL,
    "sellerPaid" boolean DEFAULT false NOT NULL,
    "d17PhoneNumber" text,
    "d17TransferReference" text,
    "d17TransferProof" text
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItem" (
    id integer NOT NULL,
    quantity integer NOT NULL,
    "unitPrice" double precision NOT NULL,
    subtotal double precision NOT NULL,
    "orderId" integer NOT NULL,
    "dishId" integer,
    "formationId" integer
);


ALTER TABLE public."OrderItem" OWNER TO postgres;

--
-- Name: OrderItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."OrderItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."OrderItem_id_seq" OWNER TO postgres;

--
-- Name: OrderItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."OrderItem_id_seq" OWNED BY public."OrderItem".id;


--
-- Name: Order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Order_id_seq" OWNER TO postgres;

--
-- Name: Order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Order_id_seq" OWNED BY public."Order".id;


--
-- Name: Recipe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Recipe" (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "imageUrl" text,
    ingredients text NOT NULL,
    steps text NOT NULL,
    "preparationTime" integer NOT NULL,
    "cookingTime" integer,
    difficulty text NOT NULL,
    servings integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" integer NOT NULL,
    "categoryId" integer
);


ALTER TABLE public."Recipe" OWNER TO postgres;

--
-- Name: Recipe_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Recipe_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Recipe_id_seq" OWNER TO postgres;

--
-- Name: Recipe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Recipe_id_seq" OWNED BY public."Recipe".id;


--
-- Name: Review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Review" (
    id integer NOT NULL,
    rating integer NOT NULL,
    comment text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" integer NOT NULL,
    "dishId" integer NOT NULL
);


ALTER TABLE public."Review" OWNER TO postgres;

--
-- Name: Review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Review_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Review_id_seq" OWNER TO postgres;

--
-- Name: Review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Review_id_seq" OWNED BY public."Review".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    phone text,
    city text,
    address text,
    role public."Role" DEFAULT 'CLIENT'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    "emailVerificationToken" text,
    "emailVerificationExpires" timestamp(3) without time zone,
    "sellerSubscriptionStatus" text DEFAULT 'INACTIVE'::text NOT NULL,
    "sellerSubscriptionExpiresAt" timestamp(3) without time zone,
    "sellerSubscriptionReference" text,
    "sellerSubscriptionProof" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: Comment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment" ALTER COLUMN id SET DEFAULT nextval('public."Comment_id_seq"'::regclass);


--
-- Name: Dish id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Dish" ALTER COLUMN id SET DEFAULT nextval('public."Dish_id_seq"'::regclass);


--
-- Name: Formation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Formation" ALTER COLUMN id SET DEFAULT nextval('public."Formation_id_seq"'::regclass);


--
-- Name: Order id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order" ALTER COLUMN id SET DEFAULT nextval('public."Order_id_seq"'::regclass);


--
-- Name: OrderItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem" ALTER COLUMN id SET DEFAULT nextval('public."OrderItem_id_seq"'::regclass);


--
-- Name: Recipe id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recipe" ALTER COLUMN id SET DEFAULT nextval('public."Recipe_id_seq"'::regclass);


--
-- Name: Review id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review" ALTER COLUMN id SET DEFAULT nextval('public."Review_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name, type) FROM stdin;
1	Cuisine tunisienne	BOTH
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Comment" (id, content, "createdAt", "userId", "recipeId") FROM stdin;
\.


--
-- Data for Name: Dish; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Dish" (id, name, description, price, "imageUrl", quantity, availability, "preparationTime", city, allergens, "createdAt", "updatedAt", "sellerId", "categoryId") FROM stdin;
22	Chapati Thon	Chapati au thon.	3.7	/dishes/chaneb-chapati-thon.png	40	t	15	Sahloul	Gluten, poisson	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	5	1
23	Chapati Salami	Chapati au salami.	3.5	/dishes/chaneb-chapati-salami.png	40	t	15	Sahloul	Gluten	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	5	1
24	Chapati Jambon	Chapati au jambon.	4	/dishes/chaneb-chapati-jambon.png	40	t	15	Sahloul	Gluten	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	5	1
17	Chapati Escalope	Chapati garni d omelette escalope, fromage gruyere et frites.	7.5	/dishes/chaneb-chapati-escalope.png	40	t	20	Sahloul	Gluten, oeufs, lait	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	5	1
18	Chapati Chawarma	Chapati garni d omelette chawarma, fromage gruyere et frites.	7	/dishes/chaneb-chapati-chawarma.png	40	t	20	Sahloul	Gluten, oeufs, lait	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	5	1
25	Plat Escalope	Assiette escalope avec salade, 2 oeufs et frites.	15	/dishes/chaneb-plat-escalope.png	40	t	25	Sahloul	Oeufs	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	5	1
26	Plat Chawarma	Assiette chawarma avec salade, 2 oeufs et frites.	12	/dishes/chaneb-plat-chawarma.png	40	t	25	Sahloul	Oeufs	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	5	1
27	Plat Tunisien	Assiette tunisienne au thon, salade et 2 oeufs.	8.5	/dishes/chaneb-plat-tunisien.png	40	t	20	Sahloul	Oeufs, poisson	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	5	1
28	Plat Kafteji	Assiette kafteji avec 2 oeufs et frites.	7	/dishes/chaneb-plat-kafteji.png	40	t	20	Sahloul	Oeufs	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	5	1
31	Sahfa thoum	Sahfa thoum selon la carte du vendeur.	4	/dishes/chaneb-sahfa-thoum.png	40	t	15	Sahloul	\N	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	5	1
35	Lablebi speciale	Lablebi speciale selon la carte du vendeur.	9.8	/dishes/chaneb-lablebi-speciale.png	40	t	20	Sahloul	Gluten	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	5	1
37	Hargma	Hargma a la facon ChanebPlusSahloul.	12	/dishes/chaneb-hargma.png	40	t	20	Sahloul	\N	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	5	1
38	Sandwich Escalope	Sandwich a l escalope.	7.5	/dishes/chaneb-sandwich-escalope.png	40	t	15	Sahloul	\N	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	5	1
40	Sandwich Chawarma	Sandwich chawarma.	7	/dishes/chaneb-sandwich-chawarma.png	40	t	15	Sahloul	\N	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	5	1
42	Sandwich Thon	Sandwich au thon.	4.2	/dishes/chaneb-sandwich-thon.png	40	t	10	Sahloul	Poisson	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	5	1
45	Sandwich Kafteji	Sandwich kafteji.	3.5	/dishes/chaneb-sandwich-kafteji.png	40	t	10	Sahloul	\N	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	5	1
46	Tabouna Kafteji	Pain tabouna garni de kafteji.	4	/dishes/chaneb-tabouna-kafteji.png	40	t	15	Sahloul	Gluten	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	5	1
47	Sandwich Lablabi	Sandwich lablabi a la mode du vendeur.	6	/dishes/chaneb-sandwich-lablabi.png	40	t	15	Sahloul	Gluten	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	5	1
43	Tabouna Thon	Pain tabouna garni au thon.	5	/dishes/chaneb-tabouna-thon.png	40	t	15	Sahloul	Gluten, poisson	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	5	1
48	Soupe d'orge aux poulpes	Soupe tunisienne au poulpe et au ble d orge, servie tres chaude.	10.5	/recipes/soupe-orge-poulpes.jpg	18	t	25	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
49	Soupe de legumes au poulet	Soupe legere au poulet et aux legumes de saison.	8.5	/recipes/soupe-legumes-poulet.jpg	18	t	20	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
50	Chorba frik au poisson	Chorba au frik et au poisson, relevee et parfumee.	11	/recipes/chorba-frik-poisson.jpg	18	t	25	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
51	Salade mechouia	Salade mechouia traditionnelle avec huile d olive et garniture tunisienne.	7.5	/recipes/mechouia-salad.webp	20	t	15	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
52	Omk houria	Entree tunisienne de carottes ecrasees, ail et harissa arbi.	6.5	/recipes/omk-houria.webp	20	t	15	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
53	Salade verte Tunisienne	Salade fraiche garnie de thon, olives et oeuf dur.	7	/recipes/salade-verte-tunisienne.jpg	20	t	10	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
54	Pates aux boulettes de viande	Pates a la sauce tomate relevee avec boulettes de viande maison.	13.5	/recipes/pates-boulettes-viande.jpg	18	t	25	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
55	Nwasser Poulet legumes	Nwasser au poulet, pois chiches et legumes en sauce.	14.5	/recipes/nwasser-poulet-legumes.jpg	18	t	30	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
56	Riz Djerbien	Riz djerbien vapeur avec viande, foie et herbes parfumees.	15	/recipes/riz-djerbien.jpg	18	t	30	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
57	Ojja merguez piquante	Ojja a la merguez avec sauce tomate epaisse et oeufs.	12	/recipes/ojja-merguez-piquante.webp	16	t	20	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
58	Kamounia au boeuf	Ragout de boeuf au cumin et a la sauce tomate reduite.	16.5	/recipes/kamounia-au-boeuf.webp	16	t	30	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
59	Markat merguez	Ragout tunisien de boulettes epicees a la sauce tomate.	15.5	/recipes/markat-merguez.webp	16	t	25	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
60	Brochettes d'agneau aux legumes	Brochettes d agneau marinees avec legumes grilles.	19	/recipes/brochettes-agneau-legumes.jpg	14	t	25	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
61	Kebab au poulet	Brochettes de poulet marinees aux epices tunisiennes.	14	/recipes/kebab-poulet.jpg	14	t	20	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
62	Poulet farci	Poulet entier farci au riz parfume et cuit au four.	22	/recipes/poulet-farci.jpg	10	t	40	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
63	Tajine de pates au poulet	Tajine de pates au poulet, fromage et olives.	13	/recipes/tajine-pates-poulet.jpg	16	t	25	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
64	Tajine Minina tunisienne	Tajine minina leger au poulet, oeufs et carottes.	11.5	/recipes/tajine-minina-tunisienne.jpg	16	t	20	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
65	Tajine El bey	Tajine el bey en couches avec viande, epinards et ricotta.	17	/recipes/tajine-el-bey-nouvelle-facon.jpg	14	t	30	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
66	Sandwich merguez tunisien	Sandwich de street food garni de merguez, frites et salade tunisienne.	8.5	/recipes/sandwich-merguez-tunisien.webp	24	t	15	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
67	Casse croute Tunisien	Baguette tunisienne garnie de harissa, thon et salade.	7.5	/recipes/casse-croute-tunisien.png	24	t	15	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
68	Chapati Tunisien	Chapati tunisien au fromage, thon, omelette et frites.	8	/recipes/chapati-tunisien.jpg	24	t	20	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
69	Kabkabou tunisien	Poisson mijote dans une sauce tomate aux olives et capres.	18	/recipes/kabkabou.webp	14	t	30	Sousse	Poisson	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
70	Mosli hout	Poisson au four a la tunisienne avec legumes et epices.	17.5	/recipes/mosli-hout-poisson-four.jpg	14	t	30	Sousse	Poisson	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
71	Calamars farcis	Calamars farcis mijotes dans une sauce tomate relevee.	19.5	/recipes/calamars-farcis-tunisienne.jpg	14	t	35	Sousse	Fruits de mer	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
72	Brik tunisienne	Brik croustillante garnie de pomme de terre, thon et oeuf.	5.5	/recipes/brik-tunisienne.webp	24	t	12	Sousse	Gluten, oeufs, poisson	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
73	Fricasse tunisien	Petit pain frit tunisien garni de thon, pommes de terre et olives.	4.5	/recipes/fricasse-tunisien.jpg	24	t	15	Sousse	Gluten, poisson	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
74	Kefta au thon	Galettes de thon panees et dorees, servies en entree.	6	/recipes/kefta-thon.png	20	t	15	Sousse	Poisson, oeufs	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
75	Couscous aux sardines	Couscous marin aux sardines farcies et sauce relevee.	16	/recipes/couscous-sardines.jpg	14	t	35	Sousse	Poisson	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
76	Couscous Tunisien a l'agneau	Couscous tunisien traditionnel a l agneau et pois chiches.	18.5	/recipes/couscous-agneau.jpg	14	t	35	Sousse	\N	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
77	Couscous au poisson tunisien	Couscous au poisson avec legumes, pois chiches et epices.	17	/recipes/couscous-poisson-tunisien.jpg	14	t	35	Sousse	Poisson	2026-05-30 21:11:56.733	2026-05-30 21:11:56.733	6	1
\.


--
-- Data for Name: Formation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Formation" (id, title, description, price, duration, level, "imageUrl", availability, "createdAt", "updatedAt", "sellerId") FROM stdin;
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, "totalPrice", status, "deliveryAddress", "paymentMethod", "paymentStatus", "createdAt", "updatedAt", "clientId", "customerFirstName", "customerLastName", "customerEmail", "customerPhone", "deliveryCity", "deliveryFee", "sellerPaid", "d17PhoneNumber", "d17TransferReference", "d17TransferProof") FROM stdin;
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItem" (id, quantity, "unitPrice", subtotal, "orderId", "dishId", "formationId") FROM stdin;
\.


--
-- Data for Name: Recipe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Recipe" (id, title, description, "imageUrl", ingredients, steps, "preparationTime", "cookingTime", difficulty, servings, "createdAt", "updatedAt", "userId", "categoryId") FROM stdin;
11	Salade mechouia	Salade tunisienne emblematique preparee avec des poivrons, tomates, oignons et ail grilles puis haches finement. Elle se sert bien fraiche avec de l huile d olive, du thon, des olives et des oeufs durs pour une entree genereuse et pleine de caractere.	/recipes/mechouia-salad.webp	4 poivrons verts. 2 tomates. 1 oignon moyen. 3 gousses d ail. 3 cuilleres a soupe d huile d olive. 1 petite boite de thon. 2 oeufs durs. Olives noires. Sel. Poivre. Carvi moulu.	Faire griller les poivrons, les tomates, l oignon et l ail jusqu a ce que la peau soit bien marquee. Laisser tiedir puis retirer la peau des legumes. Hacher finement les poivrons, les tomates, l oignon et l ail au couteau ou au pilon. Assaisonner avec le sel, le poivre, le carvi et l huile d olive puis melanger soigneusement. Dresser dans une assiette et garnir avec le thon, les olives et les oeufs durs avant de servir.	30	15	Facile	4	2026-05-29 14:33:49.885	2026-05-29 14:33:49.885	4	1
18	Kabkabou tunisien	Le kabkabou tunisien est un plat de poisson mijote dans une sauce riche a base de tomates, harissa, citron, olives et capres. Son gout profond, legerement acidule et releve, en fait une recette typique des villes cotieres, servie chaude avec du pain pour profiter pleinement de la sauce.	/recipes/kabkabou.webp	2 darnes de thon. 1 oignon eminces. 2 cuilleres a soupe d huile d olive. 2 cuilleres a soupe de harissa. 1 cuillere a soupe de concentre de tomates. 250 g de tomates cerises. 2 cuilleres a soupe de capres. 2 cuilleres a soupe d olives noires. Jus d un demi citron. Sel. Poivre. Paprika.	Assaisonner les darnes de thon avec le sel et le poivre puis les saisir rapidement dans un filet d huile. Faire revenir l oignon jusqu a ce qu il soit fondant. Ajouter la harissa, le concentre de tomates, le paprika et les tomates puis laisser compoter doucement avec un peu d eau. Incorporer les capres, les olives et le jus de citron, remettre le thon dans la sauce et laisser mijoter a feu doux jusqu a cuisson complete.	15	30	Moyen	2	2026-05-29 16:29:42.175	2026-05-29 16:29:42.175	4	1
21	Sandwich merguez tunisien	Le sandwich merguez tunisien est un classique de la street food, garni de merguez grillees, de harissa, de salade tunisienne, de frites, d olives, de capres et de piments confits. C est une recette genereuse, relevee et tres gourmande, ideale pour un repas rapide plein de saveurs.	/recipes/sandwich-merguez-tunisien.webp	1 petit pain type baguette. 3 merguez. 1 tomate coupee en des. 1 concombre coupe en des. Un demi oignon rouge emince. 1 pomme de terre coupee en frites. 1 demi citron. 3 cuilleres a soupe d huile d olive. 1 cuillere a soupe de harissa. 6 olives noires. 1 cuillere a cafe de capres. 3 piments confits. Sel. Poivre.	Faire cuire les frites au four ou a la poele jusqu a ce qu elles soient bien dorees. Griller les merguez en les retournant regulierement jusqu a cuisson complete. Preparer une petite salade avec la tomate, le concombre, l oignon, un filet d huile d olive et un peu de jus de citron. Melanger la harissa avec un peu d huile d olive puis tartiner l interieur du pain. Ajouter la salade, les merguez, les frites, les olives, les capres et les piments confits avant de servir aussitot.	30	45	Facile	1	2026-05-29 16:35:42.561	2026-05-29 16:35:42.561	4	1
22	Ojja merguez piquante	L ojja merguez piquante est une specialite tunisienne preparee avec une sauce tomate epaisse relevee a la harissa, enrichie de morceaux de merguez et terminee avec des oeufs juste cuits. C est un plat chaleureux, intense et tres parfume, generalement servi directement a la poele avec du pain.	/recipes/ojja-merguez-piquante.webp	250 g de merguez coupee en morceaux. 3 oeufs. 1 tomate coupee en des. 3 piments rouges emincees. 6 gousses d ail hachees. 1 tasse d eau. 3 cuilleres a soupe de concentre de tomates. 2 cuilleres a soupe d huile d olive. 2 cuilleres a soupe de harissa. 1 cuillere a soupe de coriandre moulue. Sel. Poivre. Persil hache. Piments confits pour servir.	Faire revenir la merguez dans l huile d olive jusqu a ce qu elle soit bien doree. Ajouter l ail puis la tomate et laisser compoter quelques minutes. Incorporer la harissa, le concentre de tomates, la coriandre, le sel, le poivre et l eau puis laisser mijoter a feu doux. Ajouter les piments emincees, casser les oeufs directement dans la sauce et poursuivre la cuisson jusqu a ce que les blancs soient pris. Finir avec un peu de persil hache et servir aussitot avec du pain.	15	25	Facile	4	2026-05-29 16:37:35.212	2026-05-29 16:37:35.212	4	1
23	Felfel mehchi	Le felfel mehchi est un poivron farci a la viande hachee epicee puis servi sur une sauce tomate relevee a la harissa. C est un plat tunisien familial, riche et reconfortant, ou la douceur du poivron et la farce savoureuse se marient avec une sauce rouge intense.	/recipes/felfel-mehchi.webp	4 a 5 grands poivrons verts. 1 oignon rouge coupe en des. 500 g de viande hachee. 1 tasse de persil hache. 1 cuillere a soupe d ail hache. 2 oeufs. 2 cuilleres a soupe d huile d olive. 1 cuillere a cafe de curcuma. 1 cuillere a cafe de paprika. Sel. Poivre. 5 tomates mixees. 2 cuilleres a soupe de harissa. 1 cuillere a soupe d ail hache pour la sauce.	Vider les poivrons et reserver. Faire revenir l oignon dans l huile d olive puis ajouter la viande hachee et les epices jusqu a bonne cuisson. Incorporer le persil, l ail et laisser tiedir avant d ajouter les oeufs. Farcir les poivrons avec cette preparation puis les faire dorer doucement dans une poele. Pour la sauce, faire revenir l ail avec l huile d olive, ajouter les tomates mixees, la harissa, le paprika et un peu d eau puis laisser mijoter jusqu a ce que la sauce epaississe. Servir chaque poivron farci sur un lit de sauce tomate bien chaude.	40	60	Moyen	4	2026-05-29 16:39:21.653	2026-05-29 16:39:21.653	4	1
24	Omk houria	Omk houria est une salade tunisienne a base de carottes longuement cuites puis ecrasees avec de l ail, de l huile d olive et des epices. Sa texture lisse et son gout releve grace a la harissa arbi en font une entree traditionnelle tres appreciee, souvent servie avec des olives, des cornichons ou des oeufs.	/recipes/omk-houria.webp	700 g de carottes. 2 a 3 cuilleres a soupe d huile d olive. 1 cuillere et demie a soupe de harissa arbi. 3 a 4 gousses d ail hachees. 1 cuillere a cafe de coriandre moulue. Une demi cuillere a cafe de carvi. 1 cuillere a cafe de sel. Olives, cornichons ou oeufs pour servir.	Faire cuire les carottes jusqu a ce qu elles soient tres tendres avec quelques gousses d ail. Les egoutter puis les ecraser encore chaudes jusqu a obtenir une texture lisse. Ajouter la harissa arbi, l ail, l huile d olive, la coriandre, le carvi et le sel puis melanger longuement. Servir dans une assiette ou un bol et garnir selon le gout avec des olives, des cornichons ou des quartiers d oeufs.	10	30	Facile	2	2026-05-29 16:40:49.216	2026-05-29 16:40:49.216	4	1
25	Brik tunisienne	La brik tunisienne est une fine feuille croustillante garnie de pomme de terre ecrasee, de thon, de capres et d un oeuf qui cuit pendant la friture. C est une recette emblematique de la cuisine tunisienne, appreciee pour son contraste entre l enveloppe doree et la farce fondante et relevee.	/recipes/brik-tunisienne.webp	6 feuilles de brik. 6 oeufs. 1 boite de thon. 1 pomme de terre cuite et ecrasee. 1 tasse d oignon finement hache. 2 cuilleres a soupe de capres. 1 cuillere a soupe d huile d olive. 1 cuillere a cafe de sel. 1 cuillere a cafe de poivre. 1 cuillere a soupe de harissa arbi. Huile pour friture.	Melanger la pomme de terre ecrasee avec l oignon, l huile d olive, le sel, le poivre et la harissa arbi. Deposer un peu de cette farce au centre d une feuille de brik, ajouter du thon, quelques capres puis casser un oeuf au milieu. Replier la feuille en triangle en gardant bien la garniture a l interieur. Faire frire dans une huile chaude jusqu a ce que la brik soit bien doree et croustillante des deux cotes, puis egoutter avant de servir aussitot avec du citron.	30	30	Moyen	6	2026-05-29 16:41:52.289	2026-05-29 16:41:52.289	4	1
29	Ojja aux fruits de mer	Cette version de l ojja aux fruits de mer est preparee avec tomates fraiches, poivrons, oeufs et un melange de fruits de mer comme calamars, poulpe, crevettes ou moules. La sauce est simple, marine et bien relevee au cumin et a la harissa arbi.	/recipes/ojja-fruits-mer-ragout.png	4 oeufs. 4 tomates fraiches. 250 g de fruits de mer selon la saison. Sel et poivre. 1 cuillere a cafe de cumin. 1 oignon. 3 gousses d ail ecrase. 2 poivrons verts. Huile d olive. 1 cuillere a cafe de harissa arbi. Persil hache.	Hacher l oignon et le faire revenir doucement dans un peu d huile. Ajouter les tomates en des et l ail ecrase puis laisser mijoter environ 10 minutes. Couper les poivrons en rondelles, les ajouter a la cuisson, saler, poivrer et verser un peu d eau avec la harissa arbi. Ajouter les fruits de mer et le cumin puis laisser mijoter encore une dizaine de minutes. Ajouter enfin les oeufs sans melanger, couvrir 5 minutes puis parsemer de persil hache avant de servir.	15	20	Facile	4	2026-05-29 16:48:17.685	2026-05-30 15:21:34.038	4	1
30	Lablebi	Le lablebi est un grand classique populaire tunisien a base de pois chiches servis tres chauds avec leur bouillon, du pain rassis, du thon, de l huile d olive, du citron et des epices. C est un plat simple, nourrissant et profondement reconfortant, souvent personnalise selon le gout de chacun avec de la harissa arbi, du cumin et parfois un oeuf.	/recipes/lablebi.webp	500 g de pois chiches secs. 1 boite de thon. Harissa arbi. Jus de citron. Huile d olive. Sel. Poivre noir. Cumin. Pain rassis. Oeufs selon le service.	Faire tremper les pois chiches puis les cuire lentement jusqu a ce qu ils soient tres tendres. Mettre du pain rassis coupe en morceaux au fond du bol puis verser une bonne quantite de pois chiches et de bouillon chaud dessus. Ajouter le thon, la harissa arbi, le cumin, le jus de citron, le sel, le poivre et un filet d huile d olive. Melanger legerement et servir bien chaud, avec un oeuf si souhaite.	10	1560	Facile	2	2026-05-29 16:49:45.975	2026-05-29 16:49:45.975	4	1
31	Markat merguez	Markat merguez est un ragout tunisien compose de petites boulettes epicees inspirees de la merguez, cuites dans une sauce tomate relevee puis accompagnees d olives et de legumes marines. C est un plat intense, chaleureux et tres parfume, ideal a servir bien chaud avec du pain.	/recipes/markat-merguez.webp	250 g de boeuf hache. 250 g d agneau hache. 4 gousses d ail hachees. 2 cuilleres a soupe de harissa arbi pour les boulettes. 1 cuillere a soupe d huile d olive. 2 cuilleres a cafe de fenouil en graines. 1 cuillere a cafe de curcuma. 1 cuillere a cafe de paprika. 1 cuillere a cafe de sel. Une demi cuillere a cafe de poivre noir. 2 tasses d eau chaude. 2 cuilleres a soupe d huile d olive pour la sauce. 2 cuilleres a soupe de concentre de tomates. 1 cuillere a soupe de harissa arbi pour la sauce. Olives noires. Legumes marines.	Melanger le boeuf, l agneau, l ail, la harissa arbi, l huile d olive et les epices puis former de petites boulettes allongees. Dans une marmite, preparer une sauce avec l huile d olive, le concentre de tomates, la harissa arbi, les epices et l eau chaude puis porter a ebullition. Ajouter delicatement les boulettes dans la sauce et laisser cuire a feu moyen jusqu a ce qu elles soient bien prises et que la sauce reduise. Ajouter enfin les olives et les legumes marines, laisser mijoter encore quelques minutes puis servir bien chaud.	20	60	Moyen	4	2026-05-29 16:50:55.2	2026-05-29 16:50:55.2	4	1
32	Kamounia au boeuf	La kamounia au boeuf est un ragout tunisien bien epice ou le cumin tient la premiere place, soutenu par une sauce tomate reduite et relevee. Les morceaux de boeuf mijotent jusqu a devenir tendres et absorbent une sauce sombre, profonde et tres parfumee, souvent servie avec du pain.	/recipes/kamounia-au-boeuf.webp	700 g de boeuf en cubes. 3 tasses d eau chaude. 3 cuilleres a soupe de concentre de tomates. 2 cuilleres a soupe de harissa arbi. 2 cuilleres a soupe d huile d olive. 3 cuilleres a cafe de paprika. 3 cuilleres a cafe de curcuma. 1 cuillere et demie a cafe de cumin. 1 cuillere a cafe de sel. 1 cuillere a cafe de poivre noir.	Assaisonner les cubes de boeuf avec le paprika, le curcuma, le sel et le poivre. Les faire revenir dans l huile d olive avec le concentre de tomates et la harissa arbi jusqu a ce que la viande prenne une belle couleur. Ajouter l eau chaude puis laisser cuire a couvert a feu moyen-doux jusqu a ce que la viande soit tendre. Decouvrir ensuite et laisser reduire la sauce jusqu a obtenir une texture epaisse et riche. Ajouter enfin le cumin, melanger et servir bien chaud.	10	35	Moyen	6	2026-05-29 16:53:01.742	2026-05-29 16:53:01.742	4	1
33	Soupe d'orge aux poulpes	La soupe d'orge aux poulpes est une soupe tunisienne parfumee et reconfortante, preparee avec des morceaux de poulpe, du ble d'orge, des pois chiches et une base tomate relevee au curcuma. Elle se sert tres chaude avec un filet de citron et offre une texture a la fois riche, marine et nourrissante.	/recipes/soupe-orge-poulpes.jpg	Un filet d'huile. Ble d'orge. 1 poulpe coupe en morceaux. 1 boite de tomates concassees. 1 oignon hache. Pois chiches trempes. 1 cuillere a cafe de curcuma. Ail hache. Celeri cisele. Citron pour servir.	Dans un faitout, faire revenir l'oignon hache dans un filet d'huile. Ajouter les morceaux de poulpe, les pois chiches et les tomates concassees puis assaisonner avec le curcuma. Couvrir d'eau et laisser cuire. Ajouter ensuite le ble d'orge, le celeri et l'ail hache puis poursuivre la cuisson jusqu'a ce que les ingredients soient tendres. Servir bien chaud avec du citron.	15	25	Facile	4	2026-05-29 17:15:30.297	2026-05-29 17:15:30.297	4	1
34	Soupe de legumes au poulet	La soupe de legumes au poulet est une soupe familiale legere et reconfortante, composee de morceaux de poulet, de legumes coupes en petits des et parfumes au curcuma. Elle se sert bien chaude et convient parfaitement pour un repas simple, sain et apaisant.	/recipes/soupe-legumes-poulet.jpg	1 blanc de poulet coupe en morceaux. 1 oignon hache. Carottes. Courgettes. Pommes de terre. Persil cisele. Margarine. Sel. Poivre. Tomates. Curcuma.	Nettoyer les legumes et les couper en cubes. Faire fondre la margarine dans un faitout puis ajouter les morceaux de poulet et les faire revenir. Assaisonner avec le sel, le poivre et le curcuma puis ajouter les legumes, le persil et les tomates. Couvrir d eau et laisser cuire jusqu a ce que le poulet et les legumes soient bien tendres avant de servir bien chaud.	15	20	Facile	4	2026-05-29 17:17:14.433	2026-05-29 17:17:14.433	4	1
35	Soupe a la viande	La soupe a la viande est une soupe tunisienne simple et chaleureuse, preparee avec de petits morceaux de viande, des tomates, des pates langue d'oiseau et quelques aromates. Sa texture legere mais nourrissante en fait une entree ou un repas du soir tres apprecie.	/recipes/soupe-a-la-viande.jpg	Pates langue d'oiseau. 1 boite de tomates en cubes. Un filet d'huile. Viande coupee en des. 1 oignon hache. Feuilles de celeri. 1 cuillere a cafe d'ail hache. 1 cuillere a cafe de curcuma. 1 pincee de paprika. Citron pour servir.	Dans un faitout, faire revenir l'oignon hache dans un filet d'huile. Ajouter les morceaux de viande et les tomates en cubes puis assaisonner avec le curcuma et le paprika. Couvrir d'eau chaude et laisser cuire jusqu'a ce que la viande soit tendre. Ajouter ensuite les petites pates langue d'oiseau, l'ail et le celeri puis poursuivre la cuisson quelques minutes jusqu'a ce que les pates soient cuites. Servir bien chaud avec un filet de citron.	10	35	Facile	2	2026-05-29 17:18:23.364	2026-05-29 17:18:23.364	4	1
36	Soupe Tunisienne aux poulpes	La soupe tunisienne aux poulpes est une soupe traditionnelle preparee a l'origine avec du poulpe seche mais qui peut aussi se cuisiner avec du poulpe frais. Elle associe poulpe, pois chiches, ble d'orge, tomate concentree et harissa arbi pour donner une soupe relevee, consistante et tres reconfortante.	/recipes/soupe-tunisienne-poulpes.jpg	1 poulpe. Tomate concentree. Ble d'orge. 1 oignon hache. Celeri cisele. Pois chiches trempes. Harissa arbi. Ail hache. Paprika. Cumin. Huile. Sel et poivre. Citron pour servir.	Dans un faitout, faire revenir l'oignon hache et les morceaux de poulpe dans un filet d'huile. Ajouter le celeri, la tomate concentree, la harissa arbi et l'ail puis mouiller avec un peu d'eau chaude. Saler, poivrer et ajouter les pois chiches. Assaisonner ensuite avec le paprika et le cumin, couvrir d'eau chaude et laisser cuire jusqu'a ce que le poulpe et les pois chiches soient tendres. Ajouter enfin le ble d'orge, poursuivre la cuisson quelques minutes puis servir bien chaud avec du citron.	10	35	Facile	4	2026-05-29 17:19:25.501	2026-05-29 17:19:25.501	4	1
37	Soupe Tunisienne langues d'oiseau a la viande de boeuf	Cette soupe tunisienne aux langues d'oiseau et a la viande de boeuf est une soupe simple et traditionnelle, tres appreciee pour sa texture legere et son gout reconfortant. Les petits morceaux de boeuf, les pois chiches et les pates langues d'oiseau cuisent dans un bouillon parfume a la tomate, a l'ail et a la harissa arbi.	/recipes/soupe-langues-oiseau-boeuf.jpg	Viande de boeuf. Tomate concentree. Pates langues d'oiseau. Tomates sechees. 1 oignon hache. Ail hache. Celeri cisele. Pois chiches trempes. Tabel. Huile d'olive. Sel et poivre. Citron pour servir.	Dans un faitout, faire revenir l'oignon dans l'huile d'olive puis ajouter les morceaux de viande et les laisser dorer. Incorporer l'ail hache et les tomates sechees, puis ajouter la tomate concentree, le celeri, les pois chiches et la harissa arbi. Couvrir d'eau, assaisonner avec le tabel, le sel et le poivre puis laisser cuire jusqu'a ce que la viande soit tendre. Ajouter enfin les petites pates langues d'oiseau et poursuivre la cuisson quelques minutes avant de servir avec un filet de citron.	10	35	Facile	2	2026-05-29 17:20:41.612	2026-05-29 17:20:41.612	4	1
38	Mhamsa Tunisienne au dbabech	La mhamsa tunisienne au dbabech est une soupe epaisse et reconfortante a base de petites pates mhamsa, de legumes secs et d'une sauce tomate relevee a la harissa arbi. Elle offre une texture genereuse et un gout profond qui en font un plat tres apprecie pendant les saisons fraiches.	/recipes/mhamsa-tunisienne-dbabech.jpg	Mhamsa. Concentree de tomate. Carotte coupee en cubes. Celeri. 1 oignon hache. Ail hache. Pois chiches trempes. Feves seches. Feves. Lentilles. Harissa arbi. Tabel. Curcuma. Huile. Sel et poivre.	Dans un faitout, faire revenir l'oignon et les cubes de carottes dans un filet d'huile. Ajouter la tomate concentree, la harissa arbi et l'ail hache puis couvrir d'eau et ajouter le celeri. Incorporer ensuite les pois chiches, les feves et les lentilles. Assaisonner avec le sel, le poivre, le tabel et le curcuma puis laisser cuire. Ajouter enfin la mhamsa et poursuivre la cuisson jusqu'a ce qu'elle soit tendre et que la soupe prenne une belle consistance.	10	20	Facile	4	2026-05-29 17:21:48.947	2026-05-29 17:21:48.947	4	1
39	Soupe langue d'oiseau au poulet	La soupe langue d'oiseau au poulet est une soupe tunisienne simple, legere et tres reconfortante. Elle associe de petits morceaux de poulet, une base tomate relevee a la harissa arbi et les petites pates langue d'oiseau, pour un resultat rapide a preparer et tres agreable a servir bien chaud avec du citron.	/recipes/soupe-langue-oiseau-poulet.jpg	Pates langue d'oiseau. Huile. 1 boite de tomates en cubes. Harissa arbi. 1 blanc de poulet coupe en cubes. 1 oignon hache. 1 pincee de sel. 1 cuillere a cafe de curcuma. Ail hache. Citron pour servir.	Dans un faitout, faire chauffer l'huile puis ajouter le poulet, l'oignon, les tomates en cubes et la harissa arbi. Assaisonner avec le curcuma, l'ail et le sel puis couvrir d'eau et laisser cuire jusqu'a cuisson du poulet. Ajouter ensuite les petites pates langue d'oiseau et poursuivre la cuisson quelques minutes jusqu'a ce qu'elles soient tendres. Servir bien chaud avec un filet de citron.	10	20	Facile	4	2026-05-29 17:22:53.803	2026-05-29 17:22:53.803	4	1
40	Hssou aux boulettes de viande	Le hssou aux boulettes de viande est une soupe tunisienne onctueuse et relevee, preparee avec une base tomate epicee et de petites boulettes de viande parfumees au tabel, au carvi et a la menthe sechee. C'est une soupe nourrissante et tres reconfortante, servie bien chaude.	/recipes/hssou-boulettes-viande.png	Viande hachee. Tomate concentree. Harissa arbi. Paprika. Tabel et carvi. Ail hache. Menthe sechee. 1 poignee de semoule moyenne. Farine. Vinaigre. Huile. Sel et poivre.	Dans un faitout, chauffer l'huile puis ajouter la tomate concentree et la harissa arbi avant de mouiller avec un peu d'eau et laisser mijoter. Ajouter ensuite l'ail hache et assaisonner de sel, poivre, tabel, carvi et paprika puis couvrir d'eau et laisser cuire. Assaisonner la viande hachee avec le tabel, le paprika, le sel, le poivre et la menthe sechee, ajouter un filet d'huile et une poignee de semoule puis former de petites boulettes. Plonger les boulettes dans la soupe. Delayer un peu de farine dans de l'eau puis verser ce melange dans la soupe en remuant. Laisser cuire encore quelques minutes, finir avec quelques gouttes de vinaigre et un peu de menthe sechee puis servir chaud.	15	25	Facile	4	2026-05-29 17:24:34.955	2026-05-29 17:24:34.955	4	1
41	Hsou aux boulettes de viande hachee	Le hsou aux boulettes de viande hachee est une soupe tunisienne tomatee, relevee a la harissa arbi et parfumee a la menthe sechee. Les petites boulettes de viande, liees avec un peu de farine dans le bouillon, lui donnent une texture onctueuse et tres reconfortante.	/recipes/hsou-boulettes-viande-hachee.jpg	1 boite de tomates en cubes. Huile. Harissa arbi. Sel. Farine. Menthe sechee. Viande hachee. Ail hache.	Mixer les tomates en cubes. Faire chauffer l huile dans un faitout puis ajouter les tomates mixees. Couvrir d eau chaude, saler et laisser cuire. Pendant ce temps, assaisonner la viande hachee avec du sel, de la harissa arbi et de l ail hache, puis former de petites boulettes. Les plonger dans la soupe. Delayer un peu de farine dans de l eau et l ajouter en remuant pour lier le bouillon. Finir la cuisson avec de la menthe sechee avant de servir.	15	25	Facile	4	2026-05-29 18:41:57.864	2026-05-29 18:41:57.864	4	1
42	Chorba frik au poisson	La chorba frik au poisson est une soupe tunisienne rapide et savoureuse, preparee avec du frik, des morceaux de poisson et un bouillon parfume au celeri, au cumin et a la harissa arbi. Elle se sert bien chaude avec un filet de citron pour renforcer son cote marin et epice.	/recipes/chorba-frik-poisson.jpg	Frik. Filets de poisson coupes en morceaux. Bouillon de poisson. 1 cuillere a soupe de concentre de tomate. Harissa arbi. Un demi oignon hache. Ail hache. Celeri. 1 cuillere a cafe de cumin. 1 cuillere a cafe de paprika. 1 cuillere a cafe de tabel. Safran. Sel et poivre.	Faire revenir l oignon dans l huile quelques minutes. Ajouter le concentre de tomate et la harissa arbi, puis verser un peu d eau chaude et laisser mijoter. Incorporer l ail, le safran et le celeri. Verser le bouillon de poisson, assaisonner avec le sel, le poivre, le tabel et le paprika, puis laisser cuire. Ajouter le poisson et le frik vers la fin de cuisson. Remuer de temps en temps, ajouter le cumin en fin de cuisson et servir bien chaud avec du citron.	10	25	Facile	2	2026-05-29 18:41:57.864	2026-05-29 18:41:57.864	4	1
43	Borghol Jari au poulpe	Le borghol jari au poulpe est une soupe tunisienne consistante ou le boulgour mijote avec des morceaux de poulpe, des pois chiches et une base tomate relevee. Le resultat est une soupe riche, epicee et tres nourrissante, ideale pour les repas d hiver.	/recipes/borghol-jari-poulpe.jpg	1 poulpe coupe en morceaux. 1 cuillere a soupe de concentre de tomate. Borghol. 1 oignon hache. Pois chiches trempes. Ail hache. Harissa arbi. Hrouss. 1 cuillere a cafe de paprika. 1 cuillere a cafe de tabel. Huile. Sel et poivre.	Dans un faitout, faire chauffer l huile et y faire sauter les morceaux de poulpe. Ajouter l oignon hache et les pois chiches puis melanger. Incorporer le hrouss, le concentre de tomate, la harissa arbi et l ail. Couvrir d eau, assaisonner avec le paprika, le tabel, le sel et le poivre puis laisser cuire. Ajouter le borghol et poursuivre la cuisson a feu doux jusqu a ce qu il soit tendre. Servir bien chaud.	15	30	Facile	4	2026-05-29 18:41:57.864	2026-05-29 18:41:57.864	4	1
44	Dwida jaria	La dwida jaria est une soupe tunisienne preparee avec des cheveux d ange, du poulet et des legumes secs, le tout releve par la harissa arbi et le concentre de tomate. Sa texture fine et son bouillon parfume en font une soupe quotidienne tres appreciee.	/recipes/dwida-jaria.jpg	Cheveux d ange. 1 blanc de poulet coupe en cubes. Lentilles. Pois chiches. Feves sechees. 1 cuillere a cafe de paprika. 1 cuillere a cafe de harissa arbi. 1 cuillere a soupe de concentre de tomate. Persil cisele. Celeri cisele. 1 cuillere a cafe de tabel. Sel et poivre. Ail hache. 1 oignon hache.	Dans une marmite, faire revenir l oignon et le poulet dans l huile. Ajouter le celeri, le concentre de tomate et la harissa arbi. Verser un peu d eau chaude et laisser mijoter. Ajouter ensuite les lentilles, les pois chiches, l ail et les feves sechees. Couvrir d eau chaude, assaisonner avec le sel, le poivre, le tabel et le paprika. Quand les legumes sont cuits, ajouter les cheveux d ange et le persil puis laisser mijoter quelques minutes avant de servir.	10	20	Facile	4	2026-05-29 18:41:57.864	2026-05-29 18:41:57.864	4	1
46	Broudou soupe tunisienne aux legumes	Le broudou est une soupe tunisienne legere et complete, preparee avec du poulet, des lentilles et plusieurs legumes coupes en cubes. Son bouillon clair, parfume au curcuma, en fait une soupe nourrissante mais facile a digerer, parfaite pour le soir.	/recipes/broudou-legumes.jpg	1 tomate. 100 g de lentilles. Epinards. Celeri. 2 navets. 1 pomme de terre. 2 carottes. 1 oignon. 4 morceaux de poulet. Curcuma. Sel et poivre.	Nettoyer les legumes et les couper en cubes. Mettre les legumes, les morceaux de poulet, l huile d olive et les epices dans une marmite. Couvrir largement d eau et mettre sur le feu. Laisser cuire doucement pendant environ une heure jusqu a ce que le poulet, les lentilles et les legumes soient bien tendres. Servir bien chaud.	15	60	Facile	4	2026-05-29 18:41:57.864	2026-05-29 18:41:57.864	4	1
47	Soupe de lentilles	La soupe de lentilles est une soupe simple et douce, preparee avec des legumes, du beurre et une touche de creme fraiche pour une texture veloutee. Elle est parfaite pour un repas leger et reconfortant, avec un gout delicat releve par le curcuma.	/recipes/soupe-lentilles.jpg	200 g de lentilles. 1 pomme de terre. 1 carotte. 1 oignon finement coupe. 1 gousse d ail. 50 g de beurre. 100 g de creme fraiche. 1 cuillere a cafe de curcuma. 1 cuillere a cafe de sel. 1 cuillere a cafe de poivre.	Dans une casserole, faire revenir l oignon finement coupe dans le beurre. Ajouter l ail, le curcuma, le sel, le poivre et l eau puis porter a ebullition. Ajouter la pomme de terre et la carotte et laisser cuire les legumes. Incorporer ensuite les lentilles et laisser mijoter jusqu a cuisson complete. Mixer la soupe au blender jusqu a obtenir une texture lisse puis ajouter la creme fraiche avant de servir.	30	30	Tres facile	4	2026-05-29 18:41:57.864	2026-05-29 18:41:57.864	4	1
48	Salade verte Tunisienne	La salade verte tunisienne est une entree fraiche et rapide preparee avec des legumes croquants coupes en petits des, puis garnie de thon, d olives et d oeuf dur. Elle est parfaite pour l ete et accompagne tres bien les plats tunisiens du quotidien.	/recipes/salade-verte-tunisienne.jpg	Tomate. Poivron vert. Concombre. Oignon. Olives. Menthe sechee. Oeuf dur. Thon. Sel. Huile d olive.	Couper la tomate, le poivron, le concombre et l oignon en petits des. Mettre le tout dans un saladier puis ajouter le sel, la menthe sechee et l huile d olive. Bien melanger. Dresser dans un plat puis decorer avec le thon, les olives et l oeuf dur avant de servir.	10	0	Facile	2	2026-05-29 18:13:05.181	2026-05-29 18:13:05.181	4	1
49	Salade de legumes a la vapeur	Cette salade de legumes a la vapeur melange pommes de terre, carottes, betteraves et petits pois avec une sauce douce a base de jaune d oeuf et de margarine. Le resultat est une salade complete, coloree et tres appreciee pour les buffets et les repas en famille.	/recipes/salade-legumes-vapeur.jpg	Pomme de terre en cubes. Carotte en cubes. Betterave en cubes. Oignon en cubes. Petits pois. Persil cisele. Ail hache. Fromage blanc en cubes. Oeufs durs. Jaune d oeuf. Thon. Margarine.	Faire chauffer de l eau dans le bas du couscoussier. Cuire a la vapeur les pommes de terre, petits pois, carottes et oignon. Cuire les betteraves a part dans de l eau puis les egoutter. Faire fondre la margarine et la melanger avec le jaune d oeuf et l ail pour obtenir une sauce. Melanger les legumes avec cette sauce puis dresser dans un plat et decorer avec les olives, le fromage, le thon et les oeufs durs.	15	30	Facile	2	2026-05-29 18:13:05.215	2026-05-29 18:13:05.215	4	1
50	Salade de poulpe	La salade de poulpe est une salade marine fraiche et savoureuse, composee de morceaux de poulpe, de tomates cerises, de laitue et de capres. Elle est relevee avec du cumin, un filet d huile d olive et decoree d oeufs durs et de croutons dores.	/recipes/salade-poulpe.jpg	Poulpe cuit coupe en morceaux. Tomates cerises. Laitue. Oignon. Capres. Oeufs durs. Croutons de pain. Ail hache. Cumin. Beurre. Huile d olive. Sel et poivre.	Faire dorer les croutons avec un peu de beurre et l ail. Dans un bol, melanger le poulpe, les tomates cerises coupees, l oignon et les capres. Assaisonner avec le cumin, le sel, le poivre et un filet d huile d olive. Disposer des feuilles de laitue dans un plat, ajouter la salade puis decorer avec les croutons et les oeufs durs coupes en quartiers.	15	5	Facile	4	2026-05-29 18:13:05.222	2026-05-29 18:13:05.222	4	1
51	Salade aux radis	La salade aux radis est une salade legere, croquante et tres fraiche, ideale pour accompagner un repas simple ou une grillade. Les rondelles fines de radis se marient avec une sauce citronnee a la moutarde et quelques herbes.	/recipes/salade-radis.jpg	Laitue. Radis. Huile d olive. Sel et poivre. Persil cisele. Oignon hache. Moutarde. Jus de citron.	Laver les radis puis les couper en fines rondelles. Dans un saladier, melanger le sel, le poivre, le jus de citron, l huile d olive et la moutarde. Ajouter les radis, l oignon hache et le persil puis melanger. Dresser sur un lit de laitue et servir frais.	10	0	Facile	2	2026-05-29 18:13:05.227	2026-05-29 18:13:05.227	4	1
52	Salade de betteraves	La salade de betteraves est une salade coloree et equilibree, preparee avec des cubes de betteraves, des olives, du persil et une vinaigrette au cumin. Elle apporte une touche douce et terreuse, relevee par quelques capres et un peu de piment.	/recipes/salade-betteraves.jpg	Betteraves cuites en cubes. Oignon hache. Persil cisele. Piment de cayenne. Olives denoyautees. Capres. Oeuf dur. Cumin. Huile d olive. Sel et poivre.	Faire cuire les betteraves dans de l eau salee si besoin puis les couper en des. Mettre les betteraves, les olives et le persil dans un saladier. Preparer une vinaigrette avec le cumin, le sel, le poivre et l huile d olive. Verser sur la salade, melanger puis decorer avec l oeuf dur, les capres et une pointe de piment avant de servir.	10	0	Facile	2	2026-05-29 18:13:05.231	2026-05-29 18:13:05.231	4	1
53	Salade vegetarienne	Cette salade vegetarienne combine courgette, carotte, chou rouge et haricots verts avec une vinaigrette citronnee. Elle est complete, fraiche et tres agreable en entree ou en repas leger.	/recipes/salade-vegetarienne.jpg	Courgette. Carotte. Haricots verts. Oignon. Chou rouge. Laitue. Oeuf dur. Graines de pavot. Fromage. Sel et poivre. Huile d olive. Citron.	Couper les carottes, les courgettes, l oignon et le chou rouge en lamelles. Cuire les haricots verts a l eau. Faire griller rapidement les lamelles de carottes et de courgettes puis les assaisonner. Dresser la laitue dans un plat, ajouter le chou rouge, les carottes, les courgettes, les haricots et l oignon. Arroser d une vinaigrette a l huile d olive et au jus de citron puis decorer de fromage, d oeuf dur et de graines de pavot.	10	10	Facile	2	2026-05-29 18:13:05.236	2026-05-29 18:13:05.236	4	1
54	Salade de pomme de terre a la Tunisienne	La salade de pomme de terre a la tunisienne est un grand classique, prepare avec des pommes de terre encore tiedes, du thon, des olives, des capres et un assaisonnement au carvi et a la harissa arbi. Elle se sert fraiche ou tiede selon les envies.	/recipes/salade-pomme-terre-tunisienne.jpg	Pommes de terre. Harissa arbi. Capres. Thon. Olives. Oeuf dur. Carvi. Sel et poivre. Jus de citron. Huile d olive.	Eplucher les pommes de terre et les couper en morceaux reguliers puis les faire cuire a l eau salee. Dans un saladier, melanger le jus de citron, le carvi, la harissa arbi, le sel, le poivre et l huile d olive. Ajouter les pommes de terre cuites et melanger delicatement. Dresser dans un plat puis decorer avec le thon, l oeuf dur coupe, les olives et les capres.	5	20	Facile	2	2026-05-29 18:13:05.24	2026-05-29 18:13:05.24	4	1
55	Salade de borghol	La salade de borghol est une salade complete a base de boulgour, de tomates cerises, de haricots rouges, d olives et de fromage. Elle est assaisonnee simplement avec huile d olive et citron, pour une assiette fraiche et nourrissante.	/recipes/salade-borghol.jpg	Borghol. Haricots rouges. Tomates cerises. Olives noires. Fromage en cubes. Huile d olive. Sel et poivre. Jus de citron. Pepins de courge. Origan.	Faire cuire le borghol dans de l eau bouillante puis l egoutter. Le mettre dans un saladier et ajouter les tomates cerises, les olives, les haricots rouges, les pepins de courge et l origan. Arroser avec l huile d olive et le jus de citron puis assaisonner avec le sel et le poivre. Melanger de nouveau et finir avec les cubes de fromage.	10	30	Facile	2	2026-05-29 18:13:05.244	2026-05-29 18:13:05.244	4	1
56	Salade aux fruits de mer	La salade aux fruits de mer est une salade fraiche et legere composee de poulpes, seiches, tomates, pommes de terre et basilic. Elle offre un bel equilibre entre saveurs marines et legumes, avec une vinaigrette simple au citron.	/recipes/salade-fruits-de-mer.jpg	Poulpes cuits en petits cubes. Seiches cuites en petits cubes. Tomates. Pomme de terre. Oignon. Persil hache. Basilic frais. Jus de citron. Huile d olive. Sel et poivre.	Couper les tomates et l oignon en petits cubes. Cuire la pomme de terre puis la couper en des et l egoutter. Mettre dans un saladier les tomates, l oignon, les seiches, les poulpes, la pomme de terre et le persil hache. Melanger le jus de citron, l huile d olive, le sel et le poivre puis verser sur la salade. Dresser dans un plat et decorer avec du basilic frais et quelques tomates cerises.	10	30	Facile	3	2026-05-29 18:13:05.247	2026-05-29 18:13:05.247	4	1
57	Salade de riz a la Tunisienne	La salade de riz a la tunisienne est une salade froide riche et pratique, avec du riz, du thon, des olives, des capres, de la tomate et de l oeuf dur. Elle est ideale pour les repas d ete et les pique-niques.	/recipes/salade-riz-tunisienne.jpg	Riz cuit. Olives denoyautees. Thon. Tomates en cubes. Piments de cayenne. Capres. Persil hache. Oeuf dur. Vinaigre. Oignon hache. Vinaigrette. Mayonnaise.	Mettre le riz cuit dans un saladier avec le persil, l oignon, les cubes de tomates, les olives et le thon puis melanger. Ajouter la vinaigrette, la mayonnaise, l oeuf dur coupe et les capres puis melanger de nouveau. Dresser dans une assiette et decorer avec des olives et du piment selon le gout.	10	0	Facile	4	2026-05-29 18:13:05.251	2026-05-29 18:13:05.251	4	1
58	Salade d'aubergine	La salade d'aubergine est une entree genereuse ou des aubergines revenues sont melangees avec oignon, thon, capres et harissa arbi. Elle se presente joliment avec oeuf dur, tomates cerises et olives pour une assiette tres gourmande.	/recipes/salade-aubergine.jpg	Aubergines. Oignon hache. Persil hache. Vinaigre. Harissa arbi. Capres. Thon. Sel et poivre. Margarine. Oeuf dur. Tomates cerises. Olives noires.	Couper deux aubergines en cubes puis les faire revenir dans un peu de margarine. Couper la troisieme dans la longueur et recuperer la pulpe en gardant la peau intacte si souhaite. Dans un saladier, melanger les oignons haches, le vinaigre, l huile d olive et la harissa arbi puis saler et poivrer. Ajouter les cubes d aubergine, le thon et les capres. Dresser dans le creux d aubergine ou dans une assiette et decorer avec l oeuf dur, les tomates cerises et les olives.	10	5	Facile	2	2026-05-29 18:13:05.255	2026-05-29 18:13:05.255	4	1
59	Salade tunisienne d'ete	La salade tunisienne d'ete est une salade ultra fraiche a base de concombre, tomate, poivron et oignon, relevee par la menthe sechee et une simple sauce au citron. Elle se termine avec du thon et des oeufs durs pour la decoration.	/recipes/salade-tunisienne-ete.png	Tomates fermes. Poivrons verts. Oignon moyen. Concombre. Menthe sechee. Sel et poivre. Huile d olive. Citron ou vinaigre. Oeufs durs. Thon.	Couper le concombre, la tomate, le poivron et l oignon en petits cubes puis les mettre dans un saladier. Melanger le jus de citron, l huile d olive, le sel et le poivre dans un petit bol. Ajouter la menthe sechee, verser sur les legumes et bien melanger. Dresser dans un plat et decorer avec des oeufs durs et des morceaux de thon.	15	0	Facile	4	2026-05-29 18:13:05.259	2026-05-29 18:13:05.259	4	1
60	Salade Blankit Revisitee	La salade Blankit revisitee est presentee ici sous forme de petites tartines garnies, inspirees des saveurs tunisiennes. Le pain grille recoit une base relevee puis une garniture de thon, fromage, olives et oeuf pour une entree originale a partager.	/recipes/salade-blankit-revisitee.jpg	Tranches de pain grille. Harissa arbi douce. Thon emiette. Fromage en cubes. Olives vertes et noires. Oeufs durs. Un filet d huile d olive.	Faire griller les tranches de pain. Tartiner legerement de harissa arbi. Ajouter le thon emiette, quelques cubes de fromage, des rondelles d olives et des morceaux d oeuf dur. Arroser d un tres leger filet d huile d olive puis servir aussitot en entree ou en aperitif.	20	5	Facile	6	2026-05-29 18:13:05.263	2026-05-29 18:13:05.263	4	1
61	Hrous	Le hrous est une preparation tunisienne a base de poivrons haches, d ail, de carvi et d huile d olive. Il se conserve en bocal et accompagne tres bien les plats, sandwichs et entrees tunisiennes.	/recipes/hrous.jpg	Poivrons rouges. Poivrons verts. Sel. Ail ecrase. Carvi. Huile d olive. Coriandre moulue.	Laver les poivrons puis retirer les queues et les graines. Les hacher finement puis les laisser egoutter quelques heures pour retirer le surplus de liquide. Ajouter l ail, la coriandre moulue, le carvi et le sel a la puree obtenue. Mettre dans un bocal, couvrir d huile d olive et conserver au frais.	20	0	Facile	6	2026-05-29 18:13:05.267	2026-05-29 18:13:05.267	4	1
62	Harissa maison facile	La harissa maison facile est une recette simple pour preparer une pate de piments tunisienne au gout intense. Elle se conserve plusieurs semaines au frais sous une couche d huile d olive.	/recipes/harissa-maison-facile.jpg	Piments rouges seches. Sel. Huile d olive.	Faire tremper les piments dans l eau tiede pendant une vingtaine de minutes. Retirer les pedoncules et les graines. Passer les piments au hachoir ou les mixer finement. Ajouter du sel, mettre dans un bocal puis recouvrir d huile d olive. Conserver au frais.	10	0	Tres facile	4	2026-05-29 18:13:05.271	2026-05-29 18:13:05.271	4	1
63	Salade de poulet pour l'ete	La salade de poulet pour l'ete est une salade complete et rafraichissante qui associe laitue, tomates, oeufs, fromage et blancs de poulet. Elle se sert bien froide avec une vinaigrette simple au vinaigre et a l huile d olive.	/recipes/salade-poulet-ete.jpg	Laitue. Oeufs. Tomates. Blancs de poulet. Emmental. Huile d olive. Vinaigre. Sel et poivre.	Faire cuire les blancs de poulet dans une poele puis les laisser refroidir avant de les couper. Faire cuire les oeufs durs, les ecaler et les couper. Couper les tomates en des puis tout mettre dans un saladier avec le fromage coupe. Preparer une vinaigrette avec l huile d olive, le vinaigre, le sel et le poivre. Melanger puis dresser sur des feuilles de laitue.	15	10	Facile	4	2026-05-29 18:13:05.273	2026-05-29 18:13:05.273	4	1
64	Zouza Tunisienne au caramel	La zouza tunisienne au caramel est une petite gourmandise sablee composee de deux coques legerement dorees reunies par un coeur fondant au caramel. Sa forme evoque une noix et elle accompagne parfaitement le cafe ou le the.	/recipes/zouza-caramel.jpg	Farine. Beurre. Oeufs. Sucre glace. Levure chimique. Sucre vanille. Lait concentre sucre. Sel. Cerneaux de noix.	Preparer d abord un caramel epais a partir du lait concentre puis laisser refroidir. Travailler le beurre avec le sucre, ajouter les oeufs puis la farine, la levure et une pincee de sel. Former de petites boules, les cuire dans un moule adapte ou au four jusqu a legere coloration. Garnir deux coques avec le caramel et, si souhaite, un morceau de noix puis assembler.	50	45	Facile	8	2026-05-29 18:45:21.163	2026-05-29 18:45:21.163	4	1
65	Harissa haloua Basboussa	La harissa haloua, aussi appelee basboussa ou gateau de semoule, est un grand classique moelleux et parfume a l eau de rose. Elle est imbibee de sirop et souvent decoree d amandes avant d etre servie en petits carres.	/recipes/harissa-haloua-basboussa.jpg	Semoule fine. Sucre. Eau de rose. Beurre fondu. Huile. Levure chimique. Yaourt nature. Amandes. Eau. Jus de citron.	Melanger la semoule, le sucre et la levure puis ajouter l huile, le beurre fondu, le yaourt et l eau de rose. Etaler la pate dans un moule beurre et enfourner jusqu a belle cuisson. Preparer un sirop avec eau, sucre et jus de citron. A la sortie du four, arroser le gateau avec le sirop en plusieurs fois, laisser absorber puis decorer d amandes avant de couper.	20	45	Facile	8	2026-05-29 18:45:21.189	2026-05-29 18:45:21.189	4	1
66	Biscuit tunisien Bachkoutou	Le bachkoutou est un biscuit tunisien simple et leger, souvent parfume au fenouil et au sucre vanille. Il est ideal au petit dejeuner ou au gouter, accompagne d un cafe ou d un verre de lait.	/recipes/bachkoutou.png	Farine. Sucre. Oeufs. Graines de fenouil. Levure chimique. Sucre vanille. Beurre.	Battre les oeufs avec le sucre et le sucre vanille. Ajouter peu a peu la farine, puis la levure, le beurre fondu et les graines de fenouil. Former une pate homogene, faconner les biscuits et les cuire au four jusqu a ce qu ils soient legerement dores.	20	20	Facile	8	2026-05-29 18:45:21.191	2026-05-29 18:45:21.191	4	1
67	Petits fours Tunisiens aux amandes	Ces petits fours tunisiens aux amandes sont delicats, fondants et tres elegants a servir avec du the ou du cafe. Leur texture legere vient des blancs d oeufs et de la poudre d amande parfumee a l eau de rose.	/recipes/petits-fours-amandes.png	Poudre d amande. Sucre glace. Blancs d oeufs. Eau de rose. Amandes entieres.	Melanger la poudre d amande et le sucre glace puis parfumer a l eau de rose. Incorporer progressivement les blancs d oeufs jusqu a obtenir une pate souple qui passe a la poche. Dresser de petites fleurttes sur une plaque, decorer d une amande entiere puis cuire au four jusqu a legere coloration.	50	10	Facile	10	2026-05-29 18:45:21.194	2026-05-29 18:45:21.194	4	1
68	Cake au yaourt	Le cake au yaourt est un gateau familial tres moelleux et facile a preparer avec des ingredients simples. Il se deguste nature, avec du sucre glace ou accompagne d un cafe au petit dejeuner.	/recipes/cake-yaourt.jpg	Yaourt nature. Farine. Oeufs. Sucre. Huile. Levure chimique. Sucre vanille.	Melanger le yaourt et le sucre, puis ajouter les jaunes d oeufs et l huile. Incorporer la farine, la levure et le sucre vanille. Monter les blancs en neige puis les ajouter delicatement. Verser dans un moule beurre et cuire au four jusqu a ce que le cake soit bien dore et moelleux.	40	30	Facile	8	2026-05-29 18:45:21.195	2026-05-29 18:45:21.195	4	1
69	Cake au droo	Le cake au droo est un gateau nourrissant et parfume, enrichi de dattes, raisins secs, amandes et sesame. Sa saveur rustique et douce en fait une tres bonne patisserie de gouter.	/recipes/cake-droo.jpg	Droo. Farine. Sucre. Oeufs. Dattes en morceaux. Raisins secs. Amandes. Beurre. Huile. Sesame. Levure chimique. Sucre vanille.	Battre les oeufs et le sucre, puis ajouter la farine et la levure. Incorporer le beurre, l huile, puis les raisins, les morceaux de dattes, les amandes et le sesame. Verser dans un moule beurre et cuire au four jusqu a ce que le cake soit bien pris et dore.	45	40	Facile	8	2026-05-29 18:45:21.198	2026-05-29 18:45:21.198	4	1
70	Homsia Ghrayba au pois chiche	La homsia, ou ghrayba au pois chiche, est un biscuit fondant traditionnel prepare avec de la farine de pois chiches torrefies. Il a une texture friable et un gout delicat qui rappelle les douceurs anciennes tunisiennes.	/recipes/homsia-pois-chiche.jpg	Pois chiches torrefies moulus. Farine. Beurre. Huile. Sucre en poudre.	Melanger la farine de pois chiches torrefies avec la farine. Ajouter le beurre noisette, l huile et le sucre puis travailler a la main jusqu a obtenir une pate homogene. Laisser reposer, former des petits boudins, marquer la surface puis cuire au four jusqu a cuisson douce sans trop colorer.	30	15	Facile	8	2026-05-29 18:45:21.202	2026-05-29 18:45:21.202	4	1
71	Kaak el warka	Le kaak el warka est une patisserie tunisienne blanche en forme d anneau, composee d une fine pate sucree et d une farce tendre aux amandes parfumee a l eau de rose. C est une douceur festive tres raffinee.	/recipes/kaak-el-warka.jpg	Farine. Beurre. Eau de rose. Poudre d amande. Sucre glace.	Preparer une pate souple avec la farine, le beurre et une partie de l eau de rose. Melanger a part la poudre d amande et le sucre glace avec le reste d eau de rose pour faire la farce. Etaler tres finement la pate, former des boudins de farce, les enrouler puis fermer en anneaux. Cuire rapidement au four sans les laisser colorer.	60	10	Facile	5	2026-05-29 18:45:21.204	2026-05-29 18:45:21.204	4	1
72	Debla oudhnine el kadhi	La debla, ou oudhnine el kadhi, est une patisserie frite en forme de rose ou de boucle, ensuite trempee dans un sirop parfume. Elle est croustillante, brillante et souvent servie lors des fetes.	/recipes/debla-oudhnine-el-kadhi.png	Farine. Oeufs. Sucre. Huile. Amidon. Huile pour friture. Eau. Eau de fleur d oranger. Citron. Graines de sesame ou pistaches.	Preparer une pate souple avec les oeufs, un peu de sucre, l huile et la farine puis laisser reposer. Faire un sirop avec l eau, le sucre, le citron et l eau de fleur d oranger. Etaler la pate finement, la couper en bandes, faconner les formes souhaitees puis les frire. Egoutter et plonger rapidement dans le sirop chaud avant de parsemer de graines de sesame ou de pistaches.	15	20	Facile	4	2026-05-29 18:45:21.206	2026-05-29 18:45:21.206	4	1
73	Bouza creme aux noisettes	La bouza creme aux noisettes est une creme dessert onctueuse et parfumee, servie bien froide dans des coupes. Sa texture lisse et sa saveur de noisette en font une douceur tres appreciee en fin de repas.	/recipes/bouza-noisettes.jpg	Noisettes. Sucre. Fecule de mais. Lait. Eau de geranium ou eau de rose. Noisettes concassees.	Griller les noisettes puis les mixer tres finement. Delayer la fecule, le sucre et la pate de noisette dans le lait. Faire cuire a feu moyen en remuant jusqu a epaississement, puis ajouter l eau de geranium ou l eau de rose. Verser dans des coupes, laisser refroidir et decorer avec des noisettes concassees.	20	15	Facile	6	2026-05-29 18:45:21.21	2026-05-29 18:45:21.21	4	1
74	Bambalouni de Tunisie	Le bambalouni est un beignet tunisien moelleux et leger, frit a la minute puis saupoudre de sucre. Il se deguste chaud et reste une des gourmandises de rue les plus emblematiques du pays.	/recipes/bambalouni.jpg	Farine. Eau tiede. Sel. Levure boulangere. Sucre. Huile pour friture.	Diluer la levure dans un peu d eau tiede puis melanger avec la farine, le sel et le reste d eau pour obtenir une pate tres souple et collante. Laisser reposer plusieurs heures. Chauffer l huile, faconner les beignets a la main en formant un trou au centre puis les frire des deux cotes. Egoutter et servir tiede avec du sucre.	10	10	Facile	10	2026-05-29 18:45:21.212	2026-05-29 18:45:21.212	4	1
75	Baklawa El Bey	Baklawa El Bey est une patisserie fine aux amandes colorees, presentee en petites pieces tricolores. Son gout delicat d amande et d eau de rose en fait une douceur elegante pour les occasions speciales.	/recipes/baklawa-el-bey.jpg	Amandes moulues. Sucre. Sucre vanille. Colorant vert. Colorant rouge. Eau de fleur de rose.	Preparer un sirop leger avec le sucre, le sucre vanille et l eau de fleur de rose. Ajouter aux amandes moulues pour former une pate homogene. Diviser la preparation en trois et colorer deux parties, l une en vert et l autre en rouge, en laissant la troisieme blanche. Etaler les trois couches a epaisseur egale, les superposer puis couper en petits losanges ou carres.	30	10	Facile	20	2026-05-29 18:45:21.213	2026-05-29 18:45:21.213	4	1
76	Gateau courant dair Khobzet hwe	Le gateau courant d air, ou Khobzet hwe, est un dessert frais monte en couches de biscuits au cafe et de creme au fromage. Il se prepare sans cuisson au four et se sert bien froid apres repos.	/recipes/khobzet-hwe.jpg	Biscuits petits beurres. Fromages carres. Creme fraiche. Creme chantilly. Sucre en poudre. Lait. Noisettes et amandes concassees. Cafe.	Melanger les fromages, la creme fraiche, la creme chantilly, le sucre et un peu de lait jusqu a obtenir une creme lisse. Preparer du cafe et le laisser refroidir. Alterner dans un plat des couches de biscuits trempes dans le cafe et des couches de creme, en parsemant de fruits secs concasses. Finir par une belle couche de creme, decorer puis laisser reposer au refrigerateur avant de servir.	30	0	Facile	12	2026-05-29 18:45:21.214	2026-05-29 18:45:21.214	4	1
77	Pates aux boulettes de viande	Les pates aux boulettes de viande sont un grand classique familial, avec une sauce tomate relevee a la harissa arbi, parfumee a l ail et aux epices. Les boulettes restent moelleuses et se servent posees sur les pates pour un plat genereux et tres reconfortant.	/recipes/pates-boulettes-viande.jpg	Boulettes de viande hachee. Concentre de tomate. Pates. Ail hache. Harissa arbi. Paprika. Coriandre. Feuilles de laurier. Sel et poivre. Huile.	Faire cuire les pates dans de l eau bouillante salee puis les egoutter. Dans un faitout, melanger l huile, le concentre de tomate, l ail hache et un peu d eau chaude puis porter sur le feu. Ajouter la harissa arbi, les feuilles de laurier, le paprika, la coriandre, le sel et le poivre puis laisser mijoter. Incorporer les boulettes de viande et poursuivre la cuisson jusqu a ce qu elles soient bien cuites. Melanger les pates avec la sauce et dresser dans un plat en deposant les boulettes par-dessus.	15	20	Facile	4	2026-05-30 15:02:24.851	2026-05-30 15:02:24.851	4	1
78	Pates Tunisiennes au poisson	Les pates tunisiennes au poisson marient une sauce tomate relevee a la harissa arbi avec des tranches de poisson bien assaisonnees. C est un plat simple, marin et parfumee, termine avec un peu de fromage rape pour une touche encore plus gourmande.	/recipes/pates-tunisiennes-poisson.jpg	4 tranches de poisson. 1 cuillere a soupe de concentre de tomate. 1 boite de tomates concassees. Pates. Tomates cerises. Piments de cayenne. Paprika. Harissa arbi. Coriandre. Cumin. Ail hache. Fromage rape. Huile d olive. Feuilles de laurier. Sel.	Mixer la harissa arbi avec les tomates concassees, les tomates cerises et l ail. Faire chauffer un filet d huile dans une poele puis ajouter l ail hache, la harissa arbi et le melange de tomates. Assaisonner de sel et de paprika, puis ajouter les piments et les feuilles de laurier. Cuire les pates dans l eau bouillante salee. Assaisonner les tranches de poisson avec harissa arbi, ail, cumin, paprika et coriandre, puis les plonger dans la sauce quelques minutes. Egoutter les pates, les melanger a la sauce, dresser dans un plat et poser le poisson dessus avant de finir avec un peu de fromage rape.	10	20	Facile	4	2026-05-30 15:02:24.876	2026-05-30 15:02:24.876	4	1
79	Tagliatelle au poulet et champignons	Les tagliatelles au poulet et champignons se preparent dans une sauce douce a la creme, relevee par l ail, le thym et un peu de basilic. C est un plat rapide, fondant et tres agreable pour un repas simple et elegant.	/recipes/tagliatelle-poulet-champignons.jpg	Tranches de poulet. 1 paquet de tagliatelle. 1 paquet de champignons. 1 oignon hache. Ail hache. Thym seche. Feuilles de basilic. Fromage rape. Margarine. Creme liquide. Sel et poivre.	Faire cuire les tagliatelles dans l eau bouillante salee. Pendant ce temps, faire revenir l oignon dans la margarine puis ajouter les morceaux de poulet et les faire dorer. Incorporer l ail hache et les champignons. Verser la creme liquide, saler, poivrer et ajouter le thym, puis laisser cuire doucement en ajoutant si besoin un peu d eau de cuisson des pates. Egoutter les pates, les melanger a la sauce, ajouter le basilic et le fromage rape puis dresser dans un plat.	10	20	Facile	4	2026-05-30 15:02:24.878	2026-05-30 15:02:24.878	4	1
143	Casse croute Tunisien	Le casse croute tunisien est une baguette genereusement garnie de harissa, salade tunisienne, salade mechouia, thon, olives, capres et variantes. C est un sandwich classique des snacks tunisiens, simple et tres parfume.	/recipes/casse-croute-tunisien.png	Baguettes. Harissa. Huile d olive. Salade tunisienne. Salade mechouia. Thon emiette. Olives. Capres. Variantes. Frites. Persil. Oignon hache.	Couper les baguettes en deux puis les fendre. Tartiner d harissa, ajouter la salade mechouia et la salade tunisienne, puis une bonne quantite de thon. Garnir d olives, de capres, de variantes, de persil et d oignon hache. Terminer avec quelques gouttes d huile d olive et servir.	15	0	Facile	4	2026-05-30 17:23:04.849	2026-05-30 17:23:04.849	4	1
80	Dwida mfawra au poulet	La dwida mfawra au poulet est une specialite tunisienne de vermicelles cuits a la vapeur avec une sauce tomate relevee et garnis de poulet, pois chiches et legumes. Le plat est tres parfumee et absorbe bien la sauce pour rester moelleux et riche en gout.	/recipes/dwida-mfawra-poulet.jpg	Cuisses de poulet. 1 cuillere a soupe de tomate concentree. Vermicelles. 1 pomme de terre. 2 carottes. 2 poivrons. 1 oignon hache. Ail hache. Pois chiches trempes. 1 cuillere a cafe de harissa arbi. Curcuma. Cannelle. Sel et poivre. Huile.	Dans le bas du couscoussier, faire revenir l oignon dans un filet d huile puis ajouter les cuisses de poulet et les faire dorer. Ajouter la tomate concentree, la harissa arbi, un peu d eau chaude, l ail, le sel, le poivre et le curcuma. Incorporer les pois chiches et les legumes, couvrir d eau et laisser cuire. Pendant ce temps, melanger les vermicelles avec un peu d huile, de curcuma et de cannelle. Les mettre dans le haut du couscoussier et laisser cuire a la vapeur. Arroser les vermicelles avec une ou deux louches de sauce, bien melanger puis servir avec le poulet, les pois chiches et les legumes.	15	25	Facile	4	2026-05-30 15:02:24.88	2026-05-30 15:02:24.88	4	1
81	Nwasser Poulet legumes	Le nwasser au poulet et legumes est un plat tunisien cuit au couscoussier, ou les petites pates absorbent une sauce tomate a la harissa arbi. Il se sert avec du poulet, des pois chiches, des carottes, des poivrons et des pommes de terre pour une assiette bien complete.	/recipes/nwasser-poulet-legumes.jpg	500 g de nwasser. Morceaux de poulet. 2 cuilleres a soupe de concentre de tomate. 1 poignee de pois chiches trempes. Margarine. 1 cuillere a cafe de harissa arbi. 1 oignon hache. 3 feuilles de laurier. Paprika. Tabel. 2 poivrons. 1 pomme de terre. Ail hache. 2 carottes. Sel et poivre.	Eplucher les pommes de terre et les carottes, puis couper les legumes. Dans le bas du couscoussier, faire chauffer l huile, frire les poivrons, les retirer puis faire revenir l oignon. Ajouter les morceaux de poulet, le concentre de tomate et la harissa arbi. Couvrir d eau, ajouter l ail, le laurier et les pois chiches, puis assaisonner avec paprika, tabel, sel et poivre. Ajouter les carottes en cours de cuisson. Pendant ce temps, melanger le nwasser avec la margarine, le mettre dans le haut du couscoussier et le cuire a la vapeur. L arroser directement avec la sauce, laisser absorber puis dresser avec le poulet et les legumes.	20	30	Facile	4	2026-05-30 15:02:24.883	2026-05-30 15:02:24.883	4	1
82	Chorba mfawara a l'agneau	La chorba mfawara a l agneau est une pate vapeur tunisienne servie avec une sauce tomate relevee, des morceaux d agneau, des pois chiches et des legumes. La pate est cuite dans le haut du couscoussier puis imbibee de sauce pour un resultat fondant et bien epice.	/recipes/chorba-mfawara-agneau.jpg	500 g de chorba mfawara. Viande d agneau. 2 cuilleres a soupe de concentre de tomate. 1 pomme de terre en quartiers. 1 carotte en quartiers. Coulis de tomate fraiche. 2 poivrons. 1 oignon hache. Huile. Ail hache. 1 cuillere a soupe de harissa arbi. 1 poignee de pois chiches trempes. Tabel. Paprika. Curcuma. Sel et poivre.	Dans le bas du couscoussier, faire revenir les poivrons dans l huile puis les retirer. Ajouter l oignon hache et les morceaux d agneau. Incorporer le coulis de tomate, le concentre de tomate, l ail hache, la harissa arbi, les quartiers de pomme de terre et les pois chiches. Assaisonner de tabel, paprika, curcuma, sel et poivre, couvrir d eau chaude puis ajouter les carottes. Pendant ce temps, melanger la chorba mfawara avec un peu d huile, de sel, de poivre et de curcuma. La mettre dans le haut du couscoussier pour la cuisson vapeur, l arroser ensuite avec la sauce et servir avec l agneau, les pois chiches et les legumes.	15	25	Facile	4	2026-05-30 15:02:24.885	2026-05-30 15:02:24.885	4	1
83	Cheveux d'ange aux boulettes de viande a la vapeur	Les cheveux d'ange aux boulettes de viande a la vapeur sont des vermicelles fins cuits au couscoussier, parfumes par une sauce tomate relevee et servis avec des boulettes, des carottes et des poivrons. C est un plat genereux qui reste leger tout en absorbant tres bien la sauce.	/recipes/cheveux-ange-boulettes-vapeur.jpg	250 g de cheveux d ange. Viande hachee. Tomate concentree. 1 oignon hache. 2 poivrons verts. 2 carottes. Harissa arbi. Harouss. Paprika. Tabel. Curcuma. 1 oeuf battu. Chapelure. 2 feuilles de laurier. Huile. Sel et poivre.	Preparer les boulettes en melangeant la viande hachee avec la chapelure, le harouss, le sel, le poivre et l oeuf battu, puis former des boulettes. Dans le bas du couscoussier, faire revenir l oignon, les poivrons et les boulettes dans l huile. Ajouter la tomate concentree, la harissa arbi et les feuilles de laurier, puis couvrir d eau et assaisonner avec tabel, paprika, curcuma, sel et poivre. Pendant ce temps, melanger les cheveux d ange avec un peu d huile puis les mettre dans le haut du couscoussier pour la cuisson vapeur. Arroser ensuite avec la sauce, laisser absorber et servir avec les boulettes, les carottes et les poivrons.	20	25	Facile	2	2026-05-30 15:02:24.887	2026-05-30 15:02:24.887	4	1
84	Pate ressort a la bolognaise	La pate ressort a la bolognaise est un plat de pates a la sauce viande et legumes, parfume aux herbes et au harouss. La sauce mijote doucement avant de venir enrober les pates, pour un resultat tres savoureux et bien concentre.	/recipes/pate-ressort-bolognaise.jpg	Pates ressort aux legumes. 400 g de viande hachee. 1 branche de tomates cerises. 3 carottes rapees. 3 oignons rapes. Celeri hache. 3 gousses d ail ecrasees. Harouss. Thym et romarin. 2 feuilles de laurier. 1 pincee de sel. 3 piments rouges seches. Huile d olive. 1 aubergine rapee. Tomates pelees.	Faire revenir la viande hachee dans l huile et assaisonner de sel. Ajouter ensuite les oignons, les carottes, l aubergine, le celeri et les tomates pelees. Assaisonner avec les piments seches, le thym, le romarin, le harouss et les feuilles de laurier. Ajouter la branche de tomates cerises et l ail ecrase, couvrir d eau et laisser cuire une vingtaine de minutes. Faire cuire les pates dans l eau bouillante salee, les egoutter puis les melanger a la sauce. Laisser encore cuire quelques minutes avant de dresser.	15	30	Facile	4	2026-05-30 15:02:24.888	2026-05-30 15:02:24.888	4	1
85	Riz Djerbien	Le riz djerbien est un plat tunisien complet ou le riz cuit a la vapeur avec de la viande, du foie, des legumes et une base tomate relevee a la harissa arbi. Il offre une texture riche, tres parfumee, et se sert en plat unique avec des petits pois, pois chiches et herbes fraiches.	/recipes/riz-djerbien.jpg	Riz. Viande et foie en petits morceaux. 2 cuilleres a soupe de concentre de tomate. 1 oignon hache. 1 carotte en petits cubes. 1 poivron. Piments de cayenne. 1 poignee de petits pois. 1 poignee de pois chiches trempes. Persil hache. Feuilles d epinard hachees. Menthe sechee. Paprika. Tabel. Curcuma. 1 cuillere a soupe de harissa arbi. Ail hache. Huile d olive. Sel et poivre.	Mettre de l eau dans le bas du couscoussier et porter a chauffe. Dans un grand saladier, melanger un filet d huile avec la paprika, le tabel, le curcuma, le sel, le poivre, l ail, la harissa arbi et le concentre de tomate. Ajouter le riz ainsi que les morceaux de viande et de foie. Incorporer les epinards, le persil, l oignon, la carotte, les petits pois, la menthe sechee et les pois chiches puis bien melanger. Mettre la preparation dans le haut du couscoussier et cuire a la vapeur en melangeant regulierement. Dresser dans un plat et decorer de poivron frit et de piment.	30	60	Facile	2	2026-05-30 15:02:24.89	2026-05-30 15:02:24.89	4	1
86	Cheveux d'anges aux fruits de mer	Les cheveux d'anges aux fruits de mer sont prepares dans un bouillon parfume aux legumes, avant d etre melanges avec tomates, poivrons, calamars, moules et crevettes. Le plat est leger, marin et tres parfume, avec une belle finition au persil et au safran.	/recipes/cheveux-ange-fruits-mer.jpg	500 g de vermicelles. 1 poisson. Bouillon de carottes, tomates, peaux de crevettes, oignons et feuille de laurier. 1 poivron rouge. 1 poivron vert. 2 gousses d ail. 400 g de tomates pelees. 250 g de moules. 250 g de crevettes moyennes. 250 g de calamars. Persil. Sel et poivre. Safran. 3 cuilleres a soupe d huile d olive.	Preparer un bouillon avec les carottes, les tomates, les peaux de crevettes, les oignons et la feuille de laurier. Ajouter le poisson et laisser cuire doucement. Faire dorer les cheveux d anges a sec dans une grande poele. Cuire les moules a la vapeur puis les reserver. Faire chauffer l huile dans une poele, ajouter les poivrons et l ail finement coupes, puis les tomates. Filtrer le bouillon. Ajouter les calamars en rondelles a la poele, puis le persil et le safran. Incorporer les vermicelles avec le bouillon, puis finir avec les crevettes et les moules. Cuire a feu vif jusqu a absorption puis laisser reposer avant de servir.	20	30	Facile	4	2026-05-30 15:02:24.891	2026-05-30 15:02:24.891	4	1
87	Vermicelles tunisiennes a la viande - Douida mfawra	Les vermicelles tunisiennes a la viande, ou douida mfawra, sont cuites a la vapeur puis arrosees de sauce tomate relevee. Le plat se sert avec des morceaux de boeuf, des pois chiches et des poivrons, pour une recette tunisienne simple et tres savoureuse.	/recipes/vermicelles-viande-douida-mfawra.jpg	250 g de viande de boeuf. 500 g de vermicelle. Huile d olive. 2 cuilleres a soupe de concentre de tomate. 2 feuilles de laurier. 1 cuillere a cafe de piment rouge moulu. Sel et poivre. 1 cuillere a cafe de coriandre. 3 poivrons. Pois chiches trempes. 1 oignon emince.	Dans le bas du couscoussier, faire revenir dans l huile l oignon emince, les morceaux de viande, le concentre de tomate et les epices pendant quelques minutes. Ajouter un peu d eau chaude puis les pois chiches et les feuilles de laurier. Laisser mijoter avant d ajouter encore de l eau. Pendant ce temps, melanger les vermicelles avec un peu d huile, les mettre dans le haut du couscoussier et les cuire a la vapeur. Arroser avec une ou deux louches de sauce, laisser cuire encore et ajouter de l eau a la sauce si besoin. Ajouter les poivrons dans la sauce, puis verser le tout dans un plat, arroser du reste de sauce et laisser finir quelques minutes avant de servir chaud.	15	25	Facile	4	2026-05-30 15:02:24.893	2026-05-30 15:02:24.893	4	1
88	Cuisse de poulet au four	La cuisse de poulet au four est preparee avec une marinade au beurre fondu, curcuma, thym et romarin, puis servie avec tomates, poivrons et oeufs frits. C est un plat simple, colore et tres savoureux, ideal pour un repas familial genereux.	/recipes/cuisse-poulet-four.jpg	1 cuisse de poulet. 2 tomates coupees en cubes. 3 poivrons. 1 oignon hache. Persil cisele. Thym et romarin. Curcuma. Epices pour poulet. 2 oeufs. Beurre fondu. Huile pour friture. Sel et poivre.	Faire chauffer un peu d huile. Mettre la cuisse de poulet dans un bol, ajouter le beurre fondu, le curcuma, les epices pour poulet, le thym, le romarin, le sel et le poivre, puis laisser mariner. Mettre ensuite la cuisse de poulet dans un plat allant au four et cuire dans un four prechauffe a 180 degres. Frire separement les poivrons, les tomates et les oeufs. Dresser le tout dans un plat puis parsemer de persil cisele et d oignon hache.	20	30	Facile	1	2026-05-30 15:21:33.988	2026-05-30 15:21:33.988	4	1
89	Ain Sbaniouria revisitee	Ain Sbaniouria revisitee est une preparation de viande hachee farcie d oeufs durs, panee puis frite, avant d etre servie sur une sauce tomate epicee. Le contraste entre la farce moelleuse et la sauce relevee donne un plat riche et tres original.	/recipes/ain-sbaniouria-revisitee.jpg	300 g de viande hachee. Concentre de tomate. 1 boite de tomates concassees. Persil cisele. 1 oignon hache. Menthe sechee. Harissa arbi. Paprika. Farine. Chapelure. Fromage rape. 1 oeuf. 4 oeufs durs. Huile d olive. Sel et poivre. Huile pour friture.	Mixer la viande hachee avec l ail, la harissa arbi, la menthe sechee, la chapelure, le persil et l oignon. Ajouter le fromage rape et le sel puis melanger jusqu a obtenir une pate. Aplatir une portion de viande, mettre un oeuf dur au milieu puis rouler pour l enfermer. Refaire la meme chose pour les autres pieces et les mettre au frais. Les passer ensuite dans la farine, l oeuf battu et la chapelure, puis les frire. Pour la sauce, faire revenir un peu d huile avec l ail hache et le concentre de tomate, assaisonner de sel, tabel, poivre et harissa arbi, puis ajouter les tomates concassees et laisser cuire. Dresser la sauce et poser dessus l ain sbaniouria.	10	20	Facile	4	2026-05-30 15:21:34.012	2026-05-30 15:21:34.012	4	1
90	Lahmet thon au four	Lahmet thon au four est un plat compose de tranches de poulet recouvertes d une farce au thon, oeufs, fromage et capres, puis gratinees avec une sauce tomate epicee. Le resultat est fondant, releve et tres gourmand.	/recipes/lahmet-thon-four.jpg	1 blanc de poulet coupe en tranches. Concentre de tomate. 1 oignon hache. Persil cisele. Ail hache. Harissa arbi. Paprika. Tabel et carvi. Thym et romarin. Capres. Fromage rape. 2 oeufs durs rapes. 1 boite de thon. Huile d olive. Sel et poivre.	Faire revenir l oignon dans un filet d huile puis ajouter le concentre de tomate et un peu d eau. Assaisonner avec l ail, le sel, le poivre, le paprika, le tabel et le carvi, puis laisser cuire la sauce. Assaisonner les tranches de poulet avec le sel, le poivre, le thym et le romarin et laisser mariner. Dans un bol, melanger le persil, les capres, le fromage, les oeufs durs rapes et le thon pour faire la farce. Disposer les tranches de poulet dans un plat allant au four, ajouter la farce dessus, couvrir avec la sauce et un peu de fromage rape, puis enfourner a 180 degres environ 15 minutes. Servir avec du persil cisele.	20	15	Facile	4	2026-05-30 15:21:34.014	2026-05-30 15:21:34.014	4	1
91	Mloukhia Tunisienne	La mloukhia tunisienne est un plat lentement mijote, a base de poudre de mloukhia, viande de boeuf et epices. Sa sauce sombre et profonde demande du temps, mais donne un resultat intense, riche et tres traditionnel.	/recipes/mloukhia-tunisienne-ragout.jpg	150 g de mloukhia. 500 g de viande de boeuf en morceaux. 1 cuillere a cafe de concentre de tomate. 1 cuillere a cafe de harissa arbi. 2 feuilles de laurier. 1 oignon hache. Eau chaude. 1 cuillere a cafe de tabel. Huile. Paprika. Sel.	Assaisonner la viande avec l ail, la harissa arbi, le laurier, le paprika, le tabel, l huile et laisser mariner. Verser la poudre de mloukhia dans une marmite et la couvrir d huile, puis bien melanger. Ajouter l oignon, le concentre de tomate et les feuilles de laurier et faire revenir en remuant. Verser progressivement des louches d eau chaude en remuant jusqu a obtenir une sauce fluide. Couvrir et laisser cuire a feu doux pendant environ 5 heures en remuant de temps en temps et en ajoutant un peu d eau si besoin. Ajouter ensuite les morceaux de viande et finir la cuisson jusqu a ce que l huile remonte a la surface.	10	300	Facile	4	2026-05-30 15:21:34.017	2026-05-30 15:21:34.017	4	1
92	Chakchouka au Kadid	La chakchouka au kadid marie tomates, poivrons, viande sechee et oeufs dans une sauce rouge relevee au harissa arbi et au harouss. C est un plat rustique, tres concentre en gout, qui se prepare rapidement.	/recipes/chakchouka-kadid.jpg	Tomates coupees en cubes. Poivrons coupes en cubes. Kadid. 1 cuillere a soupe de harissa arbi. 1 cuillere a cafe de harouss. 1 oignon. Oeufs. Sel et poivre. 1 cuillere a cafe de carvi. 1 cuillere a cafe de paprika.	Couper l oignon en lamelles. Faire revenir le kadid et l oignon dans l huile. Ajouter les poivrons coupes en des, la harissa arbi et le harouss. Assaisonner avec le sel, le poivre, le carvi et le paprika. Ajouter ensuite les tomates coupees en des, verser un peu d eau et laisser cuire. Quand la sauce a bien reduit, ajouter les oeufs, entiers ou legerement battus selon le gout. Couvrir encore environ 2 minutes pour terminer la cuisson.	10	15	Facile	4	2026-05-30 15:21:34.019	2026-05-30 15:21:34.019	4	1
93	Kamounia	La kamounia est un plat tunisien tres parfume au cumin, prepare avec viande de boeuf, foie et abats, dans une sauce tomate reduite. Le gout est puissant et profond, et le plat se sert souvent avec du pain.	/recipes/kamounia-ragout.jpg	2 cuilleres a soupe de tomate concassee. Viande de boeuf en cubes. Foie et abats en cubes. 1 cuillere a cafe d ail hache. 1 cuillere a cafe de cumin. Sel et poivre. 1 cuillere a cafe de curcuma. 2 poivrons verts. 1 cuillere a cafe de tabel. 1 cuillere a cafe de farine. Huile. 1 poivron rouge seche.	Faire revenir l oignon et le poivron seche dans l huile. En parallele, assaisonner la viande et les abats avec tabel, sel, poivre et curcuma. Ajouter la viande et les abats dans la marmite avec un peu de farine et faire revenir. Incorporer les tomates concassees et laisser cuire. Ajouter ensuite les poivrons et le cumin apres cuisson de la viande, laisser encore 5 minutes puis dresser dans un plat et parsemer de persil hache.	10	25	Facile	2	2026-05-30 15:21:34.022	2026-05-30 15:21:34.022	4	1
94	Haricots blancs aux boulettes de viande	Ce rago?t de haricots blancs aux boulettes de viande est prepare dans une sauce tomate relevee a la harissa arbi, parfumee au tabel, paprika et menthe sechee. Les boulettes mijotent avec les haricots pour donner un plat chaud, complet et tres nourrissant.	/recipes/haricots-blancs-boulettes.jpg	Viande hachee. Haricots blancs trempes. 1 oignon hache. 2 poivrons. 1 cuillere a cafe d ail hache. Variantes ou olives selon le service. 1 cuillere a soupe de concentre de tomate. 1 cuillere a cafe de menthe sechee. Sel et poivre. Tabel. Paprika. Harissa arbi. Huile.	Preparer les boulettes en melangeant la viande hachee avec l ail, la coriandre, le paprika, la harissa arbi, la menthe sechee, le sel, le poivre et un filet d huile. Former des boulettes. Dans une marmite, faire frire les poivrons, ajouter les boulettes pour les saisir puis les retirer et les reserver. Faire revenir l oignon, ajouter le concentre de tomate et la harissa arbi. Couvrir d eau, incorporer les haricots blancs, assaisonner de tabel, poivre et paprika puis laisser cuire. En fin de cuisson, remettre les boulettes et ajouter les variantes ou olives avant de servir.	20	30	Facile	4	2026-05-30 15:21:34.026	2026-05-30 15:21:34.026	4	1
95	Kafteji au foie	Le kafteji au foie est une assiette tunisienne composee de pommes de terre, courgettes, poivrons, tomates, oeufs et foie revenus, puis haches ensemble. C est un plat riche, populaire et tres savoureux, servi avec huile d olive, persil et oignon.	/recipes/kafteji-foie.jpg	Foie. 1 cuillere a cafe d ail hache. 1 courgette. Poivrons. 3 oeufs. Pommes de terre. Tomates. Sel et poivre. 1 cuillere a cafe de tabel. 1 cuillere a cafe de paprika.	Eplucher les pommes de terre, les couper, les frire et les mettre dans un bol. Faire ensuite frire les courgettes et les poivrons. Saler et poivrer le foie puis le faire revenir dans une poele. Le retirer, puis dans la meme poele faire chauffer l huile, revenir l ail et ajouter les morceaux de tomates. Verser un peu d eau, assaisonner de sel, poivre, tabel et paprika puis laisser mijoter. Frire les oeufs a part. Reunir les frites, les oeufs, les courgettes, les poivrons et la sauce tomate dans un grand bol puis hacher grossierement avec 2 couteaux. Servir avec un filet d huile d olive, du persil, de l oignon hache et les morceaux de foie.	20	20	Facile	4	2026-05-30 15:21:34.028	2026-05-30 15:21:34.028	4	1
96	Ojja aux Merguez	L ojja aux merguez est un plat tunisien rapide et tres savoureux, ou des merguez cuisent dans une sauce tomate relevee avant de recevoir les oeufs. La preparation est simple, mais donne un resultat riche et complet.	/recipes/ojja-merguez-ragout.png	4 oeufs. 250 g de merguez. 4 gousses d ail. 1 cuillere a soupe de concentre de tomate. 1 tomate coupee. 1 cuillere a cafe de harissa arbi. 1 poivron. 1 cuillere a cafe de paprika. Huile d olive. 1 cuillere a cafe de carvi. Persil et oignon haches.	Verser l huile d olive dans une poele et ajouter la tomate coupee. Diluer le concentre de tomate dans un peu d eau et y ajouter l ail, la harissa arbi, le paprika et le carvi. Laisser cuire sur feu doux une dizaine de minutes, puis ajouter les merguez et laisser mijoter encore environ 15 minutes. Couper le poivron en lamelles et l ajouter a la sauce. Faire de petits puits dans la sauce, casser les oeufs dessus et les laisser cuire sans melanger. Finir avec du persil et de l oignon haches.	10	25	Tres facile	4	2026-05-30 15:21:34.03	2026-05-30 15:21:34.03	4	1
97	Ojja aux boulettes de viande	L ojja aux boulettes de viande associe une sauce tomate relevee, de petites boulettes bien epicees et des oeufs poches directement dans la preparation. C est un plat intense, genereux et parfait a manger avec du pain.	/recipes/ojja-boulettes-viande-ragout.jpg	250 g de viande hachee. 3 piments verts. 4 tomates. 1 cuillere a soupe de harissa arbi. 1 cuillere a soupe de concentre de tomate. 4 oeufs. 6 gousses d ail. 1 cuillere a cafe de cumin. 1 cuillere a cafe de menthe sechee. 1 verre d huile. 1 cuillere a cafe de coriandre. Sel et poivre.	Assaisonner la viande hachee avec sel, poivre, curcuma, 4 gousses d ail ecrasees, coriandre et un peu de menthe sechee puis former des petites boulettes. Dans une casserole, faire revenir l huile puis incorporer le concentre de tomate. Ajouter 2 gousses d ail ecrasees, la harissa arbi et les tomates coupees en petits des, saler et poivrer puis faire revenir quelques minutes. Mouiller a l eau chaude, ajouter les boulettes et cuire environ 20 minutes. Ajouter les piments verts en petits des, laisser cuire encore, puis ajouter le cumin. Disposer ensuite les oeufs delicatement dans la preparation et cuire jusqu a coagulation des blancs. Servir avec un peu de persil.	5	40	Facile	4	2026-05-30 15:21:34.033	2026-05-30 15:21:34.033	4	1
98	Ojja bil Mokh	L ojja bil mokh est une variante plus riche de l ojja tunisienne, preparee avec de la cervelle d agneau, des oeufs et une sauce tomate relevee a la harissa arbi. Le resultat reste fondant, epice et tres parfume.	/recipes/ojja-bil-mokh.jpg	1 cervelle de mouton. 4 oeufs. 4 cuilleres a soupe d huile d olive. 2 cuilleres a soupe de concentre de tomate. 1 citron. 1 cuillere a cafe de harissa. 4 gousses d ail hachees. Une demi cuillere a cafe de piment fin. Une demi cuillere a cafe de carvi en poudre. Sel.	Laver la cervelle. La mettre dans une eau salee bouillante avec quelques gouttes de citron et laisser cuire environ 10 minutes. Egoutter puis couper en petits cubes. Dans une casserole, mettre l huile d olive sur feu doux. Ajouter le concentre de tomate dilue dans un verre d eau avec la harissa, le paprika, l ail et le carvi, saler et remuer. Couvrir et laisser bouillir quelques minutes. Ajouter ensuite les oeufs et les morceaux de cervelle, laisser un moment puis retirer du feu et servir avec un peu de persil et d oignon haches.	20	20	Tres facile	4	2026-05-30 15:21:34.035	2026-05-30 15:21:34.035	4	1
99	Brochettes d'agneau aux legumes	Ces brochettes d agneau aux legumes sont preparees avec des morceaux d epaule marine dans l huile d olive, le citron, le sel et le poivre, puis alternes avec oignons, tomates et poivron. C est une recette simple, familiale et tres parfumee, ideale pour une cuisson au gril.	/recipes/brochettes-agneau-legumes.jpg	400 g d epaule d agneau. 3 oignons. 3 tomates. 1 poivron. 1 demi verre d huile d olive. 1 citron. Sel. Poivre.	Verser l huile d olive et le jus de citron dans un saladier, puis saler et poivrer. Couper la viande et le poivron en gros des, couper les tomates en quartiers et emincer les oignons. Laisser mariner le tout environ 1 heure. Garnir les piques a brochettes en alternant morceaux d agneau, lamelles d oignons, quartiers de tomates et morceaux de poivron. Faire cuire les brochettes sur le gril et finir avec un peu de persil si souhaite.	30	60	Facile	4	2026-05-30 15:42:43.5	2026-05-30 15:42:43.5	4	1
100	Grillade de steaks de viande hachee	Cette grillade de steaks de viande hachee se prepare avec une viande assaisonnee a l oignon, au persil, au sel et au poivre, puis faconnee en petits steaks et grillee rapidement. C est une idee tres simple pour un repas d ete ou un barbecue.	/recipes/grillade-steaks-viande-hachee.jpg	500 g de viande hachee. 1 pincee de sel. 1 cuillere a cafe de poivre. 1 oeuf. 1 oignon. 1 cuillere a cafe d huile d olive. 1 bouquet de persil.	Raper ou hacher finement l oignon puis emincer le persil. Mettre la viande hachee dans un bol avec l oignon, le persil, l oeuf, le sel, le poivre et l huile d olive. Malaxer jusqu a obtenir une preparation homogene. Former des petits steaks haches. Faire chauffer une poele legerement huilee ou utiliser le gril, puis cuire les steaks en les retournant regulierement. La cuisson prend moins de 10 minutes.	20	10	Facile	6	2026-05-30 15:42:43.516	2026-05-30 15:42:43.516	4	1
101	Tete d'agneau rotie au four	La tete d agneau rotie au four est une recette traditionnelle servie avec tomates, poivrons et epices comme le curcuma, le carvi et la coriandre. La cuisson au four donne une viande tendre et tres parfumee.	/recipes/tete-agneau-rotie-four.png	1 tete d agneau. 250 g de poivrons verts. 250 g de tomates. 1 oignon. 1 demi verre d huile d olive. Romarin. 1 cuillere a soupe de carvi et coriandre. 1 demi cuillere a soupe de curcuma. 1 demi litre d eau chaude. Sel. Poivre.	Laver puis couper la tete d agneau en deux dans le sens de la longueur. Couper l oignon et les tomates en rondelles et les poivrons en deux. Disposer les rondelles d oignon dans un plat allant au four puis poser dessus les morceaux de tete d agneau. Assaisonner avec sel, poivre, curcuma, romarin, carvi et coriandre. Entourer de poivrons et de rondelles de tomates et d oignon. Arroser d huile d olive et d eau chaude puis enfourner a 180 degres pendant environ 25 minutes. Finir avec un peu de persil.	15	25	Facile	4	2026-05-30 15:42:43.518	2026-05-30 15:42:43.518	4	1
102	Kadid viande sechee	Le kadid est une viande de mouton sechee et epicee, preparee avec ail, menthe sechee, curcuma, coriandre et harissa arbi, puis suspendue plusieurs jours au soleil avant d etre conservee dans l huile. C est une preparation traditionnelle tres concentree en gout.	/recipes/kadid-viande-sechee.jpg	3 kg de viande de mouton. 100 g d ail ecrase. 2 cuilleres a soupe de tabel coriandre en poudre. 4 cuilleres a soupe de menthe sechee en poudre. 100 g de gros sel. 2 cuilleres a soupe de curcuma. 50 g de harissa arbi. 1 demi verre d huile.	Couper la viande en lanieres assez larges en suivant les os pour former de longues pieces. La premiere nuit, melanger une partie de l ail et du sel avec un peu d eau et bien frotter la viande, puis laisser au frais. Le lendemain, preparer une marinade avec le reste des epices, la harissa arbi et l huile, ajouter a la viande puis bien melanger. Suspendre la viande sur une corde en plein soleil pendant environ 3 jours en la protegeant de la pluie. Quand l interieur est bien sec, couper en morceaux de 2 a 3 cm, les saisir rapidement dans de l huile tres chaude puis laisser refroidir avant de les mettre en bocal et de les recouvrir d huile.	30	10	Facile	6	2026-05-30 15:42:43.52	2026-05-30 15:42:43.52	4	1
103	Allouch fel kolla ou agneau a la gargoulette	L allouch fel kolla est un plat d agneau cuit longuement dans une gargoulette bien fermee avec oignons, tomates, ail, pommes de terre, thym et romarin. La cuisson lente garde toute la vapeur et donne une viande tres tendre et confite.	/recipes/allouch-fel-kolla.jpg	Viande d agneau en morceaux. 2 gros oignons eminces. 2 tomates. 1 verre d huile. 2 gousses d ail. 2 pommes de terre. Thym. Romarin. Sel. Poivre.	Preparer une marinade avec les epices, l ail, les oignons, le sel et l huile, puis enrober la viande et laisser reposer toute une nuit. Faire tremper la gargoulette dans une bassine d eau pour qu elle garde son humidite. Le lendemain, ajouter les legumes a la viande et bien melanger. Vider la gargoulette, y mettre toute la preparation puis fermer tres hermetiquement avec aluminium, pate et tissu si besoin. Cuire au four prechauffe a 180 degres pendant environ 2 h 30, ou plus longtemps pour une version encore plus traditionnelle.	60	270	Moyenne	6	2026-05-30 15:42:43.522	2026-05-30 15:42:43.522	4	1
104	Kebab au poulet	Le kebab au poulet se compose de morceaux d escalope marines avec oignons, ail, curcuma, persil, sel et poivre, puis enfiles sur des brochettes et passes au gril. C est une recette legere, rapide et tres facile a servir avec salade ou riz.	/recipes/kebab-poulet.jpg	1 cuillere a cafe de curcuma. 1 cuillere a soupe de persil hache. 3 oignons haches. 1 kg d escalope de poulet en morceaux. 2 gousses d ail. 1 cuillere a cafe de sel. 1 cuillere a cafe de poivre.	Dans un grand bol, melanger les oignons, le curcuma, le poivre, le sel, le persil et l ail avec les morceaux de poulet puis laisser mariner. Piquer ensuite le poulet sur des brochettes et les faire griller jusqu a cuisson complete. Servir chaud avec une salade ou une garniture legere.	35	15	Tres facile	8	2026-05-30 15:42:43.523	2026-05-30 15:42:43.523	4	1
105	Poulet farci	Le poulet farci est prepare avec un poulet marine aux epices et au citron, puis garni d un riz parfume aux oignons, ail, piment, cannelle, clou de girofle et coriandre. La cuisson au four dore le poulet pendant que la farce reste moelleuse et parfumee.	/recipes/poulet-farci.jpg	1 poulet desosse. 2,5 tasses de riz. 1 oignon hache. 1 oignon coupe en lamelles. 1 piment en rondelles. 1 tomate en rondelles. 1 demi citron. 1 cuillere a cafe de clou de girofle. 1 cuillere a cafe de cannelle. 1 cuillere a soupe d huile d olive. 1 cuillere a cafe de curcuma. 1 cuillere a cafe de paprika. 1 cuillere a cafe de coriandre. 1 cuillere a cafe de cumin. 1 cuillere a cafe de sel. 1 cuillere a cafe de poivre.	Assaisonner le poulet avec curcuma, poivre, une pincee de sel, jus de citron et huile d olive puis laisser mariner. Dans une casserole, faire revenir l huile avec l oignon hache, l ail et le piment en cubes pendant quelques minutes. Ajouter une demi tasse de riz avec les epices et remuer. Ajouter un peu d eau et cuire le riz a moitie puis laisser refroidir. Farcir le poulet avec ce riz. Mettre le poulet dans un plat au four et l entourer de lamelles d oignon, de tomate et de piment. Couvrir d aluminium et enfourner environ une heure, puis retirer l aluminium pour faire dorer. Cuire le reste du riz a part avec cannelle, sel et poivre, puis y ajouter l oignon revenu et les clous de girofle avant de servir avec le poulet.	90	60	Moyenne	6	2026-05-30 15:42:43.525	2026-05-30 15:42:43.525	4	1
106	Steak d'agneau a la creme de champignons	Ce steak d agneau a la creme de champignons associe une viande saisie, des echalotes fondantes et des champignons de Paris dans une sauce cremeuse. C est un plat simple, elegant et rapide a preparer.	/recipes/steak-agneau-creme-champignons.jpg	4 steaks d agneau. Huile d olive. Sel. 2 oignons ou echalotes haches. 10 champignons de Paris. 20 cl de creme liquide.	Poeler les steaks d agneau avec un filet d huile d olive pour qu ils restent legerement roses. Dans une autre poele, faire revenir les echalotes environ 2 minutes a feu doux avec un filet d huile d olive. Ajouter les champignons eminces et cuire encore 2 minutes pour qu ils restent un peu croquants. Verser la creme liquide, arretez la cuisson des le debut de l ebullition et saler. Ajouter ensuite le jus de cuisson de la viande pour renforcer le gout de la sauce, puis servir aussitot avec les steaks.	10	20	Facile	4	2026-05-30 15:42:43.526	2026-05-30 15:42:43.526	4	1
107	Kefta au poulet	La kefta au poulet est une recette tunisienne simple a base de blanc de poulet hache, persil, ail, oignon, oeuf, chapelure et pomme de terre bouillie. Ces galettes sont dorees a la poele et donnent une entree moelleuse et economique.	/recipes/kefta-poulet.jpg	500 g de blanc de poulet. Persil. 1 oeuf. 1 oignon hache. 3 gousses d ail. Sel et poivre. Chapelure. 1 pomme de terre bouillie.	Hacher le poulet avec le persil, l ail, le poivre noir et le sel. Ajouter l oeuf et un peu d huile au melange. Ajouter ensuite la pomme de terre ecrasee et la chapelure, bien melanger puis former des boules ou galettes de kefta. Laisser reposer environ 30 minutes au froid puis faire cuire dans l huile chaude a feu moyen jusqu a belle coloration.	10	15	Facile	6	2026-05-30 15:56:25.192	2026-05-30 15:56:25.192	4	1
108	Brik danouni aux epinards	Le brik danouni aux epinards est prepare avec une pate brisee garnie d epinards, oignon, ricotta, thon, fromage rape et oeuf. Ces petits chaussons dores au four offrent une entree legere et savoureuse.	/recipes/brik-danouni-epinards.jpg	Pate brisee. 1 pincee de farine. Epinards haches. 1 oignon hache. 2 oeufs. Thon. Fromage rape. Ricotta. Margarine.	Faire fondre la margarine puis faire revenir l oignon et les epinards haches. Mettre cette preparation dans un bol, ajouter la ricotta, le thon, le fromage et l oeuf puis melanger. Etaler la pate sur un plan farine et decouper des cercles. Deposer une petite cuillere de farce dans chaque cercle, plier en demi cercle, poser sur une plaque couverte de papier cuisson, badigeonner de jaune d oeuf puis enfourner a 180 degres environ 20 minutes.	15	20	Facile	6	2026-05-30 15:56:25.213	2026-05-30 15:56:25.213	4	1
109	Brik de la goulette a la pate fraiche	Le brik de la Goulette a la pate fraiche utilise une pate maison tres fine garnie de puree de pomme de terre, thon, harissa, persil, oignon, fromage blanc et oeuf. Il est frit jusqu a obtenir une enveloppe doree et croustillante.	/recipes/brik-goulette-pate-fraiche.jpg	200 g de farine. Puree de pomme de terre. Persil cisele. 1 oignon hache. 1 citron. Fromage blanc. Oeufs. Thon. Harissa. Huile pour friture. Sel et poivre.	Dans le bol du petrin, mettre la farine, le sel, l oeuf et l eau tiede puis petrir jusqu a obtenir une pate souple et homogene. Diviser la pate en petites boules puis etaler chaque boule finement. Sur une moitie de feuille, deposer la puree de pomme de terre, le thon, la harissa, le persil, l oignon, le sel, le poivre et le fromage blanc. Casser un oeuf dessus, replier puis faire frire dans l huile chaude jusqu a ce que les deux faces soient dorees.	15	15	Facile	4	2026-05-30 15:56:25.215	2026-05-30 15:56:25.215	4	1
110	Doigts de Fatma au four	Les doigts de Fatma au four sont des petits rouleaux de malsouka garnis d une farce a base de puree de pomme de terre, oignon, persil, fromage, capres, thon et oeufs. Leur cuisson au four les rend plus legers tout en gardant une belle couleur doree.	/recipes/doigts-fatma-four.jpg	Feuilles de malsouka. Puree de pomme de terre. Persil cisele. 1 oignon hache. Capres. Fromage gruyere. Oeufs. Thon. Margarine.	Preparer la farce en melangeant puree de pomme de terre, oignon, persil, fromage, capres et thon. Ajouter les oeufs puis melanger. Badigeonner les feuilles de malsouka avec un peu de margarine. Deposer 2 cuilleres de farce au centre, plier en petits chaussons allonges, disposer sur une plaque allant au four puis cuire a 180 degres environ 10 minutes. Servir chaud quand les doigts prennent une belle couleur doree.	15	10	Facile	6	2026-05-30 15:56:25.217	2026-05-30 15:56:25.217	4	1
111	Brik Dannouni	Le brik dannouni est une petite brik a pate maison faite avec farine et semoule, farcie de viande hachee parfumee au harouss, tabel, paprika, ail, oignon, persil et fromages. La forme miniature en fait une entree tres gourmande.	/recipes/brik-dannouni.jpg	Viande hachee. 1 verre de farine. 2 verres de semoule. 1 oignon hache. Persil cisele. Ail hache. 1 cuillere a cafe de harouss. Paprika. Tabel. Fromage rape. Fromage blanc. 1 demi verre d eau tiede. 1 demi verre d huile d olive. Huile pour friture. Sel et poivre.	Preparer la pate en melangeant farine, semoule, sel et huile d olive, puis ajouter l eau tiede et petrir jusqu a obtenir une pate souple. Laisser reposer. Pour la farce, faire revenir dans un filet d huile l oignon, la viande hachee, le harouss, le sel, le poivre, le tabel, le paprika et l ail hache. Hors du feu, ajouter le persil cisele et les fromages. Etaler la pate tres finement, couper des cercles, mettre une petite cuillere de farce dans chaque cercle, plier en demi cercle puis refermer au bord. Faire frire jusqu a belle coloration et servir chaud.	20	25	Facile	6	2026-05-30 15:56:25.219	2026-05-30 15:56:25.219	4	1
112	Sahfa Thoum	La sahfa thoum est une entree composee d huile d olive, pate d ail, harissa, harouss et salade mechouia, puis garnie de thon, salami de boeuf, fromage, citron, capres, olives, variantes et oeuf a la coque. C est une assiette relevee et tres complete.	/recipes/sahfa-thoum.jpg	Huile d olive. Pate d ail. Harissa. Harouss. Salade mechouia. Salami de boeuf. Thon. Citron. Fromage. 1 oeuf a la coque. Olives. Capres. Variantes.	Dans un petit bol ou une assiette creuse, verser l huile d olive puis ajouter la pate d ail, la harissa, le harouss et la salade mechouia. Garnir ensuite avec l oeuf, les lamelles de salami de boeuf, le thon, le fromage, les olives, le citron, les capres et les variantes. Servir aussitot avec du pain.	5	0	Facile	1	2026-05-30 15:56:25.22	2026-05-30 15:56:25.22	4	1
113	La salade Blankit Tunisienne	La salade Blankit tunisienne est une entree froide preparee sur des tranches de pain rassies, imbibees d une sauce harissa-huile, puis garnies de thon, olives, capres, variantes, oeufs et fromage en cubes. Elle se sert souvent a l aperitif.	/recipes/salade-blankit-tunisienne.jpg	Tranches de pain rassies de 2 a 3 cm. Harissa. Variantes. Fromage en cubes. Thon. 1 poignee de capres. Oeufs durs en cubes. Huile d olive. Olives vertes coupees en rondelles.	Dans un bol, mettre l harissa avec un filet d huile d olive puis diluer avec un peu d eau. Bien imbiber de cette sauce chaque face des tranches de baguette ou de pain. Garnir ensuite avec le thon, les olives, les capres, les variantes, les oeufs durs et le fromage en cubes. Servir frais.	15	0	Facile	4	2026-05-30 15:56:25.222	2026-05-30 15:56:25.222	4	1
114	Les doigts de fatma	Les doigts de fatma sont des rouleaux de malsouka frits et garnis d une farce a la puree de pomme de terre, thon, oignon, persil, fromage rape, oeuf et capres. Leur texture croustillante en fait une entree tunisienne tres populaire.	/recipes/doigts-fatma.jpg	Puree de pomme de terre. Thon. 1 oignon hache. Persil cisele. Fromage rape. 1 oeuf. Capres. Feuilles de malsouka.	Dans un saladier, mettre la puree de pomme de terre, le thon, l oignon, le fromage et les capres. Melanger puis ajouter l oeuf. Faire chauffer l huile dans une poele. Couper les feuilles de malsouka en deux puis mettre 2 cuilleres de farce au centre de chaque feuille. Plier en petits doigts bien fermes et les faire frire jusqu a belle coloration. Servir chaud.	10	15	Facile	4	2026-05-30 15:56:25.224	2026-05-30 15:56:25.224	4	1
115	Chebtiya	La chebtiya est preparee avec beaucoup de persil et d aneth haches, melanges a l oignon, ail, harissa, semoule et oeufs, puis epices au curcuma et paprika. Les boulettes sont ensuite frites pour servir en accompagnement ou en entree.	/recipes/chebtiya.jpg	60 g de semoule moyenne. 1 bol d aneth. 1 bol de persil. 1 oignon. 1 cuillere a cafe d ail hache. 1 cuillere a cafe d harissa. 3 oeufs. Sel et poivre. 1 cuillere a cafe de curcuma. 1 cuillere a cafe de paprika.	Hacher l oignon, le persil et l aneth. Dans un saladier, mettre l aneth, le persil, l oignon, l ail et l harissa puis bien melanger. Ajouter la semoule puis les oeufs et melanger encore jusqu a obtenir une preparation qui se tient. Assaisonner de sel, poivre, curcuma et paprika. Faire chauffer l huile, former des boulettes et les faire frire jusqu a coloration.	15	20	Facile	4	2026-05-30 15:56:25.227	2026-05-30 15:56:25.227	4	1
116	Kefta tunisienne de poisson	La kefta tunisienne de poisson se prepare avec des filets de poisson cuits a la vapeur puis emiettes, melanges avec oignon, persil, ail, chapelure, oeufs et epices. Les galettes sont panees puis frites et se servent tres bien avec une sauce tomate.	/recipes/kefta-poisson.jpg	Filets de poisson. 1 oignon hache. Persil cisele. 1 cuillere a cafe d ail hache. 2 oeufs. 2 cuilleres a soupe de chapelure. Farine. 1 cuillere a cafe de curcuma. 1 cuillere a cafe de paprika. 1 cuillere a cafe de cumin. Sel et poivre. Huile pour friture.	Passer les filets de poisson a la vapeur pendant environ 5 minutes puis les emietter. Dans un saladier, mettre le poisson emiette avec l oignon, le persil et l ail puis melanger. Assaisonner avec sel, poivre, curcuma, paprika et cumin. Ajouter la chapelure et l oeuf puis laisser reposer au refrigerateur. Former des galettes, les rouler dans la farine puis dans l oeuf et la chapelure. Faire dorer sur les deux faces dans l huile chaude puis egoutter.	10	15	Facile	4	2026-05-30 15:56:25.229	2026-05-30 15:56:25.229	4	1
117	Fricasse tunisien	Le fricasse tunisien est un petit pain frit maison, garni a la tunisienne avec harissa, thon, puree de pomme de terre, oeufs durs et olives. C est une entree ou snack tres populaire, croustillant dehors et moelleux dedans.	/recipes/fricasse-tunisien.jpg	500 g de farine. 5 cl d eau tiede. 15 cl de lait tiede. 1 sachet de levure boulangere. 1 cuillere a cafe de sucre. 1 cuillere a cafe de sel. 5 cl d huile. 1 oeuf. Huile pour friture. Thon emiette. Pommes de terre en puree. Oeufs durs. Olives. Harissa.	Mettre la levure dans le lait tiede, delayer et laisser quelques minutes. Dans un bol, mettre la farine, le sucre, le sel, l oeuf, l huile et ajouter la levure delyee puis petrir en ajoutant l eau tiede petit a petit jusqu a obtenir une boule qui ne colle pas. Laisser reposer 15 minutes. Former des petites boules, laisser reposer encore 15 minutes sur un plat huile puis les faire frire en les arrosant d huile chaude jusqu a belle coloration. Egoutter, ouvrir les petits pains et les garnir avec de la harissa, du thon, de la puree de pomme de terre, des oeufs durs et des olives.	20	20	Facile	6	2026-05-30 15:56:25.23	2026-05-30 15:56:25.23	4	1
118	Kefta au thon	La kefta au thon est une galette preparee avec puree de pomme de terre, persil, fromage rape et thon emiette, puis panee dans la farine, l oeuf et la chapelure. Elle est ensuite frite jusqu a obtenir une croute croustillante.	/recipes/kefta-thon.png	2 pommes de terre. 200 g de chapelure. 1 bol de persil hache. 100 g de fromage rape. Sel et poivre. 2 oeufs. 100 g de farine. Huile pour friture. 1 boite de thon.	Eplucher les pommes de terre, les cuire a l eau salee puis les ecraser. Mettre dans un bol la puree de pomme de terre avec le persil, le fromage rape et le thon emiette. Saler et poivrer puis melanger jusqu a obtenir une pate mallleable. Faire chauffer l huile. Prendre un peu de pate, la rouler dans la main, l aplatir en galette, puis la passer dans la farine, l oeuf et la chapelure. Faire frire dans l huile chaude jusqu a belle couleur.	10	20	Facile	4	2026-05-30 15:56:25.231	2026-05-30 15:56:25.231	4	1
119	Brick tunisienne au thon	La brick tunisienne au thon est une feuille de brick garnie de puree de pomme de terre, de thon, de persil, de capres et d un oeuf. Elle est pliee puis frite rapidement pour garder un coeur fondant et une feuille bien croustillante.	/recipes/brick-tunisienne-thon.jpg	Pomme de terre. Thon. Feuilles de malsouka. 2 oeufs. 1 poignee de capres. Persil cisele.	Faire bouillir les pommes de terre puis les ecraser en puree. Faire chauffer l huile dans une poele. Dans un saladier, melanger la puree avec le thon, le persil et les capres. Sur une moitie de feuille de brick, disposer 2 cuilleres a soupe de farce puis casser un oeuf dessus. Plier puis glisser delicatement dans l huile chaude et faire dorer les deux faces.	10	10	Facile	2	2026-05-30 15:56:25.233	2026-05-30 15:56:25.233	4	1
120	Brik aux chevrettes	Le brik aux chevrettes est farci de crevettes decortiquees, oignon, persil, fromage rape et oeuf, puis plie en triangle avant friture. Le citron apporte la touche finale a cette entree de fruits de mer.	/recipes/brik-chevrettes.jpg	4 feuilles de brick ou malsouka. 200 g de chevrettes decortiquees. 4 oeufs. 100 g de fromage rape. Persil. 1 oignon. Sel et poivre. Citron. Huile pour friture.	Faire chauffer un peu d huile. Hacher finement l oignon et le persil puis ajouter les chevrettes et assaisonner avec sel et poivre. Faire revenir quelques minutes dans un peu d huile d olive. Retirer du feu, laisser refroidir puis ajouter le fromage rape. Etaler les feuilles de brick, repartir la farce, casser un oeuf au milieu puis plier en triangle. Faire frire les briks dans l huile chaude en les retournant pour dorer les deux faces. Egoutter et servir chaud avec des rondelles de citron.	5	10	Facile	4	2026-05-30 15:56:25.235	2026-05-30 15:56:25.235	4	1
121	Pain Mlawi tunisien	Le mlawi tunisien est une galette fine a base de semoule fine et de farine, travaillee avec huile d olive, eau tiede et sel, puis pliee avant cuisson a la poele. Il se mange seul ou garni en version salee ou sucree.	/recipes/pain-mlawi-tunisien.jpg	1 kg de semoule fine. 250 g de farine. Sel. Eau tiede selon besoin. 2 cuilleres a soupe d huile d olive.	Dans un grand recipient ou le bol du robot, mettre la semoule, la farine, l huile d olive et le sel. Melanger en ajoutant progressivement l eau tiede. Petrir fortement et longtemps, puis diviser la pate en boules. Aplatir une boule, l arroser d une bonne quantite d huile et la plier en 4. Aplatir encore puis cuire dans une poele chaude en retournant des que le pain brunit legerement sans durcir.	15	30	Facile	6	2026-05-30 16:18:53.822	2026-05-30 16:18:53.822	4	1
122	Pain hamburger maison ultra moelleux	Ce pain hamburger maison est prepare avec farine, beurre, lait tiede, oeuf, levure et sesame. Le resultat donne des buns tres moelleux, dores et parfaits pour les sandwiches ou burgers faits maison.	/recipes/pain-hamburger-maison.jpg	400 g de farine. 50 g de beurre. 1 oeuf. 1 verre de lait tiede. 1 cuillere a cafe de sel. 2 cuilleres a soupe de sucre. 1 sachet de levure boulangere. Graines de sesame.	Melanger la farine et la levure puis ajouter le sel et le sucre. Creuser une fontaine et verser le lait et l oeuf. Melanger puis former une boule de pate. Travailler la pate quelques minutes, incorporer le beurre en petrissant encore 8 a 10 minutes. Laisser lever la pate couverte jusqu a ce qu elle double de volume. Diviser en petites boules, les deposer espacees sur plaques, dorer au jaune d oeuf, parsemer de sesame puis enfourner environ 30 minutes a 180 degres.	25	30	Facile	6	2026-05-30 16:18:53.844	2026-05-30 16:18:53.844	4	1
123	Pain aux olives	Le pain aux olives est un petit pain maison enrichi d olives noires ou vertes et d huile d olive. Sa pate levee puis cuite avec vapeur donne une croute fine et un interieur bien moelleux.	/recipes/pain-aux-olives.jpg	350 g de farine. 150 ml d eau. 3 pincees de sel. 15 g de levure boulangere. 175 g d olives. 40 ml d huile d olive.	Delayer la levure dans l eau. Faire un puits avec la farine, verser le sel sur la farine, l eau au milieu puis commencer a melanger en incorporant petit a petit la farine et ajouter l huile d olive. Petrir la pate en la claquant sur le plan de travail. Laisser pointer environ 10 minutes. Denoyauter les olives, les hacher grossierement puis les incorporer a la pate. Laisser reposer 30 minutes, faconner en petits pains, laisser lever encore environ 1 h 30, badigeonner d huile d olive puis cuire dans un four prechauffe avec vapeur, environ 15 minutes a 210 degres.	30	15	Facile	6	2026-05-30 16:18:53.847	2026-05-30 16:18:53.847	4	1
124	Pain baguette fait maison sans semoule	Cette baguette maison sans semoule se prepare avec seulement farine, levure, eau tiede et sel. Elle donne un pain tres simple, croustillant dehors et leger dedans.	/recipes/pain-baguette-maison.jpg	250 g de farine. 12 g de levure fraiche. 5 g de sel. 160 ml d eau tiede.	Melanger la farine et le sel. Delayer la levure dans un peu d eau tiede. Mettre dans la cuve le melange farine-sel, ajouter eau et levure puis petrir. Ajouter le reste d eau tiede et petrir encore jusqu a obtenir une pate qui se decolle. Couvrir avec un torchon humide et laisser lever 1 h 30 a 2 heures. Degazer, faconner en baguettes, laisser lever encore environ 1 heure, faire des stries puis enfourner a 220 degres environ 20 minutes avec un petit recipient d eau pour garder l humidite.	20	20	Facile	4	2026-05-30 16:18:53.849	2026-05-30 16:18:53.849	4	1
125	Pain tabouna au four	Le pain tabouna au four est une version simple du khobz tabouna tunisien, faite avec farine, semoule fine, levure, huile d olive, lait, sucre, sel et graines de fenouil. Il accompagne parfaitement les plats traditionnels.	/recipes/pain-tabouna-four.png	500 g de farine. 100 g de semoule fine. 1 cuillere a soupe de levure boulangere. 1 demi verre d huile d olive. 350 ml d eau chaude. 20 g de graines de fenouil. 1 pincee de sel. 1 cuillere a soupe de sucre. 1 cuillere a soupe de lait.	Prechauffer le four a 200 degres. Melanger tous les ingredients puis ajouter l eau tiede en petrissant jusqu a former une pate souple et elastique. Petrir au moins 15 minutes. Former des boules puis laisser lever 30 minutes dans un endroit chaud. A l aide de la paume de la main, former des galettes, laisser lever encore 30 minutes, faire un trou au centre avec le doigt puis enfourner a four tres chaud pendant 15 a 20 minutes en retournant le pain a mi cuisson.	30	20	Facile	6	2026-05-30 16:18:53.851	2026-05-30 16:18:53.851	4	1
126	Pain traditionnel pour Aid Al Adha	Ce pain traditionnel pour Aid Al Adha est prepare avec semoule tres fine, farine, sesame, anis, levure et beurre ramolli. Il donne de beaux pains ronds et dores pour accompagner les plats de fete.	/recipes/pain-traditionnel-aid-adha.jpg	650 g de semoule tres fine de ble. 350 g de farine. 2 cuilleres a soupe de graines de sesame. 1 cuillere a soupe de graines d anis. 14 g de sel. 40 g de levure boulangere. 625 ml d eau tiede. 25 g de beurre ramolli.	Mettre dans une terrine ou le bol d un petrin la semoule, la farine, le sel, le sesame et l anis puis melanger. Incorporer progressivement la levure delyee dans l eau, petrir puis couvrir la pate d un linge propre et laisser reposer 15 minutes. Ajouter ensuite le beurre ramolli et petrir a nouveau. Diviser la pate en 6 parts egales, former des boules puis les aplatir sur des plaques. Couvrir d un linge propre et laisser fermenter, puis cuire environ 15 minutes dans un four prechauffe a 220 degres.	20	15	Facile	6	2026-05-30 16:18:53.852	2026-05-30 16:18:53.852	4	1
127	Petits pains farcis au thon	Les petits pains farcis au thon sont prepares avec une pate levee moelleuse puis garnis d un melange de thon, persil, oignon et citron. Ils sont dores a l oeuf et parfumes aux graines de nigelle avant cuisson.	/recipes/petits-pains-farcis-thon.jpg	500 g de farine. 1 sachet de levure boulangere deshydratee. 1 cuillere a cafe de sel. 2 cuilleres a soupe de sucre semoule. 10 cl de lait tiede. 5 cuilleres a soupe d huile. 1 oeuf. Pour la farce : 1 boite de thon, persil, demi oignon emince, sel, poivre, jus de citron. Pour la dorure : 1 oeuf battu et graines de nigelle.	Verser la levure dans le lait tiede avec le sucre et laisser 10 minutes. Dans la cuve du petrin, mettre farine, sel, huile, oeuf et verser le liquide a la levure puis petrir au moins 10 minutes. Laisser reposer la pate dans un endroit chaud pendant 1 heure puis degazer et former des boules. Pour la farce, melanger le thon, le persil, l oignon et le jus de citron, saler et poivrer. Etaler chaque boule de pate, mettre une cuillere de farce puis refermer pour former des petits pains. Laisser reposer 15 minutes, dorer a l oeuf, parsemer de nigelle et cuire environ 30 minutes a 200 degres.	30	30	Facile	6	2026-05-30 16:18:53.854	2026-05-30 16:18:53.854	4	1
128	Khobz el ghanney	Le khobz el ghanney est un pain tunisien cuit a la poele ou au tajine, prepare avec semoule fine, farine, levure et eau tiede. Il donne des galettes rondes, souples et bien dorees.	/recipes/khobz-el-ghanney.png	300 g de semoule fine. 300 g de farine. 1 pincee de sel. Huile. Levure boulangere. Eau tiede.	Diluer la levure boulangere dans l eau tiede et laisser buller quelques minutes. Melanger la farine et la semoule avec le sel puis ajouter l huile et melanger. Petrir en ajoutant la levure delyee peu a peu jusqu a obtenir une pate lisse et molle. Couvrir et laisser doubler de volume. Degazer, diviser en boules de meme taille puis aplatir sur un plan saupoudre de semoule en gardant une forme ronde d environ 1 cm d epaisseur. Faire chauffer la poele ou le tajine puis cuire les galettes des deux cotes.	15	30	Facile	4	2026-05-30 16:18:53.856	2026-05-30 16:18:53.856	4	1
142	Mtabga: Des Galettes du sud Tunisien	La mtabga est une galette du sud tunisien a base de semoule, farcie d oignons confits a la tomate concentree et a l harissa. Elle est cuite a la poele et se deguste chaude, avec une saveur bien relevee.	/recipes/mtabga-galettes-sud-tunisien.jpg	Semoule extra fine. Levure boulangere. Sel. Oignons. Harissa arbi. Tomate concentree. Huile d olive. Coriandre. Carvi. Poivre.	Melanger la semoule, le sel, la levure et l eau pour former une pate elastique puis laisser reposer. Faire revenir les oignons avec la tomate concentree, l harissa et les epices pour obtenir une farce. Etaler la pate, deposer la farce sur une moitie, refermer puis cuire la galette des deux cotes dans une poele bien chaude.	30	30	Facile	4	2026-05-30 17:23:04.848	2026-05-30 17:23:04.848	4	1
129	Couscous aux sardines	Le couscous aux sardines est prepare avec un couscous fin, des sardines farcies de persil et de sauce relevee, puis cuits avec pommes de terre, piments, oignon, concentre de tomate, harissa et curcuma. C est un couscous marin tres parfume et populaire.	/recipes/couscous-sardines.jpg	Sardines. 500 g de couscous fin. 4 pommes de terre. 4 piments. 1 oignon. 1 demi verre d huile d olive. 2 cuilleres a soupe de concentre de tomate. Persil. Curcuma. Harissa. Sel et poivre.	Nettoyer les sardines, enlever la tete et l arete interieure, bien rincer puis les couper en deux dans le sens de la longueur. Hacher une demi botte de persil et la melanger avec un filet d huile d olive, de la harissa, du sel, du poivre et un peu d eau chaude. Farcir chaque filet avec cette sauce puis rouler et piquer avec un cure dents. Dans le bas du couscoussier, faire revenir l oignon emince avec les piments entiers dans un peu d huile puis les retirer. Ajouter le concentre de tomate, la harissa, le sel, le poivre, le curcuma, le reste de sauce des sardines et un bol d eau chaude. Laisser epaissir quelques minutes puis ajouter l eau bouillante et les pommes de terre entieres pour la cuisson. Mettre le couscous humidifie dans le haut du couscoussier avec les sardines dessus et cuire a la vapeur. Aerer le couscous entre les passages vapeur puis dresser avec les sardines, les pommes de terre et les piments.	20	30	Facile	6	2026-05-30 16:39:24.981	2026-05-30 16:39:24.981	4	1
130	Couscous Tunisien a l'agneau	Le couscous tunisien a l agneau se prepare avec viande d agneau, pois chiches, concentre de tomate, raisins secs et epices comme paprika, curcuma, cannelle et laurier. Il est servi avec un couscous bien separe et decore de viande, pois chiches et poivrons.	/recipes/couscous-agneau.jpg	Morceaux de viande d agneau. Tomate concentree. Couscous. 1 oignon hache. 1 poivron vert frit. 1 piment seche. Pois chiches deja trempes. Raisins secs. Feuilles de laurier. Paprika. Curcuma. Cannelle. Huile. Sel et poivre.	Faire chauffer l eau dans le bas du couscoussier. Mettre le couscous dans un saladier, l assaisonner de sel et curcuma, melanger avec un peu d huile et d eau puis laisser reposer. Emietter le couscous entre les mains pour separer les graines puis le cuire a la vapeur environ 15 a 20 minutes. Pendant ce temps, faire revenir l oignon dans un filet d huile, ajouter la tomate concentree puis un peu d eau et laisser mijoter. Assaisonner de piment seche, sel, curcuma, paprika, laurier et cannelle. Ajouter les morceaux de viande et les pois chiches, couvrir d eau et cuire environ 30 minutes. Quand la vapeur se degage du couscoussier, retirer le couscous, le vider dans un grand plat, verser la sauce dessus et bien melanger. Dresser dans des plats et decorer avec viande, pois chiches, raisins secs et poivrons.	20	30	Facile	4	2026-05-30 16:39:25.006	2026-05-30 16:39:25.006	4	1
131	Couscous au poulpe	Le couscous au poulpe est une version marine du couscous tunisien, avec poulpe, pois chiches, concentre de tomate, harissa arbi, carottes, pommes de terre et poivrons. Il donne un plat tres riche en sauce et bien parfume.	/recipes/couscous-poulpe.jpg	Poulpe. Tomate concentree. Couscous moyen. Carottes. 2 poivrons verts. Pommes de terre coupees en quartiers. 1 oignon coupe en quartier. Pois chiches deja trempes. Ail hache. Harissa arbi. Curcuma. Cumin. Huile. Sel et poivre.	Dans le bas du couscoussier, faire revenir l oignon et le poulpe dans l huile pendant une dizaine de minutes. Ajouter les poivrons pour les frire puis les retirer. Verser un peu d eau chaude et laisser mijoter. Ajouter le concentre de tomate, la harissa arbi et les pois chiches. Assaisonner avec sel, poivre, curcuma et cumin puis couvrir d eau et laisser cuire. Pendant ce temps, melanger le couscous avec sel, curcuma et un peu d eau puis laisser reposer. Mettre le couscous dans la partie superieure du couscoussier et cuire a la vapeur. Ajouter a la sauce les legumes, carottes, pommes de terre et oignon. Quand la vapeur se degage, retirer le couscous, le mettre dans un grand plat, verser la sauce dessus et bien melanger. Dresser avec pois chiches, morceaux de poulpe et legumes.	15	35	Facile	4	2026-05-30 16:39:25.01	2026-05-30 16:39:25.01	4	1
132	Couscous complet aux legumes et au poulet	Le couscous complet aux legumes et au poulet se prepare avec couscous integral, hauts de cuisse de poulet, pois chiches, courgette, carotte, pomme de terre, poivrons et concentre de tomate. C est un plat familial complet, genereux et tres reconfortant.	/recipes/couscous-complet-legumes-poulet.png	2 cuilleres de concentre de tomate. 2 hauts de cuisse de poulet. 1 cuillere a soupe de margarine ou huile d olive. 250 g de couscous integral. 1 oignon hache. 1 pomme de terre coupee en 4. 1 carotte coupee en 4. Morceaux de courgette. 2 poivrons. Pois chiches deja trempes. Sel et poivre. 1 cuillere a cafe de tabel. 1 cuillere a cafe de paprika.	Faire chauffer l eau dans le bas du couscoussier. Dans une marmite, faire revenir l oignon et les hauts de cuisse dans la margarine ou l huile. Ajouter le concentre de tomate et les pois chiches. Eplucher les legumes, les laver et les mettre a cuire dans la sauce en les couvrant d eau, sauf les poivrons. Assaisonner avec sel, poivre, tabel et paprika. En fin de cuisson, ajouter les poivrons et laisser cuire encore 5 minutes. Dans un saladier, mettre le couscous, ajouter un demi verre d eau tiede et un filet d huile, melanger puis laisser reposer. Mettre le couscous a cuire a la vapeur encore 15 a 20 minutes. Quand la vapeur sort bien, retirer le couscous, le vider dans un grand plat, verser la sauce sur le couscous et bien melanger. Dresser avec pois chiches, poulet et legumes.	10	30	Facile	2	2026-05-30 16:39:25.014	2026-05-30 16:39:25.014	4	1
133	Couscous au poisson tunisien	Le couscous au poisson tunisien associe du couscous fin a du loup de mer, des legumes, du bouillon de poisson, de la harissa arbi et des epices comme cumin, paprika, tabel et curcuma. Il donne une sauce legere mais tres parfumee.	/recipes/couscous-poisson-tunisien.jpg	Couscous fin. 1 loup de mer coupe en trois. Bouillon de poisson. 1 pomme de terre coupee en quatre. 1 courgette coupee en quatre. 2 carottes. 1 poivron. 1 oignon emince. Pois chiches deja trempes. 2 cuilleres a soupe de concentre de tomate. 1 cuillere a cafe de harissa arbi. Ail hache. 1 cuillere a cafe de curcuma. Sel et poivre. 1 cuillere a cafe de tabel. 1 cuillere a cafe de cumin. 1 cuillere a cafe de paprika.	Dans le bas du couscoussiere, faire chauffer l huile et frire le poivron. Le retirer puis faire revenir l oignon hache. Ajouter le concentre de tomate, la harissa arbi, les pois chiches et l ail. Mouiller avec un peu d eau chaude et assaisonner avec sel, poivre, paprika, tabel et curcuma. Couvrir avec le bouillon de poisson, mettre les pommes de terre et les carottes et laisser cuire. Dans un saladier, mettre le couscous, verser un peu d huile et assaisonner avec sel, curcuma et clou de girofle si souhaite. Emietter le couscous entre les mains, verser un peu d eau chaude, melanger puis le cuire a la vapeur encore 15 a 20 minutes. Assaisonner les morceaux de poisson avec cumin puis les plonger en dernier dans la sauce avec les courgettes. Quand tout est cuit, renverser le couscous dans un grand plat, l asperger de sauce puis decorer avec poisson, legumes, pois chiches et poivrons frits.	15	20	Facile	3	2026-05-30 16:39:25.017	2026-05-30 16:39:25.017	4	1
134	Couscous tunisien au fenouil (Farfoucha)	La farfoucha est un couscous tunisien au fenouil, leger et tres parfume, prepare avec concentre de tomate, harissa arbi, ail, oignon, tabel, curcuma, paprika, olives et piments de cayenne. Il se melange apres cuisson avec les feuilles de fenouil pour un gout tres particulier.	/recipes/couscous-fenouil-farfoucha.jpg	500 g de couscous. Concentre de tomate. 2 bouquets de fenouil frais. 1 oignon hache. 4 gousses d ail hachees. Piments de cayenne. Harissa arbi. 1 cuillere a cafe de paprika. Sel et poivre. 1 cuillere a cafe de tabel. 1 cuillere a cafe de curcuma. Olives noires et vertes. Huile.	Faire bouillir l eau au fond du couscoussier. Laver et couper finement les bouquets de fenouil. Dans le haut du couscoussier, mettre le fenouil et la moitie de l oignon. Preparer le couscous comme d habitude avec sel, poivre, curcuma, un peu d huile et de l eau puis le verser dans le couscoussier. Pour la sauce, faire revenir dans une marmite l oignon et l ail dans un filet d huile. Ajouter le concentre de tomate et la harissa arbi. Verser l eau chaude puis assaisonner avec tabel, paprika, curcuma, sel et poivre et laisser cuire. Quand la sauce est prete, verser le couscous et le fenouil dans un grand plat, bien melanger pour repartir les feuilles puis ajouter la sauce afin de donner une couleur rouge orangee. Dresser et decorer avec olives et piments de cayenne.	15	30	Facile	6	2026-05-30 16:39:25.019	2026-05-30 16:39:25.019	4	1
135	Mesfouf aux graines de grenade	Le mesfouf aux graines de grenade est un couscous fin sucre, beurre et parfume a l eau de fleur d oranger, puis garni de graines de grenade. C est une version douce et festive, parfois enrichie de fruits secs ou de dattes.	/recipes/mesfouf-graines-grenade.jpg	500 g de couscous tres fin. 2 grenades bien rouges. 125 g de beurre. Un quart de verre d eau de fleur d oranger. Eau.	Dans un grand plat, mouiller les grains de couscous avec un peu d eau et bien melanger. Chauffer l eau du couscoussier en huilant la partie haute et en mettant du papier aluminium autour pour eviter la perte de vapeur. Mettre le couscous et attendre que la vapeur sorte. Renverser ensuite dans un grand plat et eparpiller les grains pour refroidir un peu. Humecter encore avec un peu d eau et renouveler cette operation deux fois. Avant la derniere cuisson vapeur, melanger l eau de fleur d oranger a l eau pour parfumer le couscous. Renverser ensuite le couscous dans un grand plat et l arroser avec le beurre clarifie chaud. Bien enrober les grains puis saupoudrer de sucre glace et servir avec les graines de grenade.	30	20	Facile	6	2026-05-30 16:39:25.022	2026-05-30 16:39:25.022	4	1
136	Mosli hout (poisson au four)	Le mosli hout est un poisson au four a la tunisienne, prepare avec des filets de dorade, des legumes coupes en quartiers et des epices simples. C est un plat leger, parfume et tres facile a servir en repas familial.	/recipes/mosli-hout-poisson-four.jpg	Filets de dorade. Pommes de terre. Tomates. Poivrons. Oignon. Huile d olive. Curcuma. Eau chaude. Sel. Poivre.	Couper les legumes en quartiers et les disposer dans un plat. Assaisonner avec du curcuma, du sel, du poivre et arroser d huile d olive. Poser les filets de dorade dessus puis mouiller avec un peu d eau chaude. Cuire au four jusqu a ce que le poisson et les legumes soient bien tendres et legerement dores.	10	35	Facile	2	2026-05-30 17:11:15.752	2026-05-30 17:11:15.752	4	1
137	Sardines farcies a la tunisienne au four	Ces sardines farcies a la tunisienne sont garnies d une farce a base de sardine, persil, pomme de terre, fromage rape et capres, puis dorees au four. Elles offrent une entree marine savoureuse et bien relevee.	/recipes/sardines-farcies-tunisienne-four.jpg	Sardines. Oignon. Persil. Sel. Poivre. Cumin. Oeuf. Pomme de terre cuite. Fromage rape. Capres. Chapelure. Beurre.	Laver, ecailler et lever les filets de sardines. Preparer la farce en mixant un peu de sardine avec l oignon, le persil, la pomme de terre, l oeuf, les capres, le fromage rape, le cumin, le sel et le poivre. Etaler la farce sur une moitie des filets puis couvrir avec les filets restants. Parsemer d un melange de chapelure et de beurre puis enfourner jusqu a belle coloration.	10	10	Facile	4	2026-05-30 17:11:15.78	2026-05-30 17:11:15.78	4	1
138	Poisson et salade tunisienne grillee	Ce plat associe du poisson grille a une salade mechouia tunisienne composee de poivrons, tomates et oignons grilles, puis garnie de thon, oeuf dur, olives et capres. C est une assiette complete, fraiche et tres parfumee.	/recipes/poisson-salade-tunisienne-grillee.jpg	Poissons entiers type dorade ou loup. Poivrons grilles. Tomates grillees. Oignon grille. Oeuf dur. Thon en boite. Capres. Olives. Coriandre. Carvi moulu. Huile d olive. Sel. Poivre.	Nettoyer les poissons, les assaisonner de sel et de poivre puis les griller a la poele ou sur gril. Hacher les poivrons, tomates et oignon grilles pour preparer une salade mechouia. Assaisonner avec coriandre, carvi, huile d olive, sel et poivre, puis dresser dans un plat. Ajouter l oeuf dur, le thon, les olives et les capres avant de servir avec les poissons grilles.	15	20	Facile	2	2026-05-30 17:11:15.781	2026-05-30 17:11:15.781	4	1
139	Calamars farcis a la Tunisienne	Les calamars farcis a la tunisienne sont garnis d une farce au persil, riz, tentacules et epices, puis mijotes dans une sauce tomate relevee a l harissa. C est un grand classique de la cuisine marine tunisienne.	/recipes/calamars-farcis-tunisienne.jpg	Calamars. Persil. Ail. Tomate concentree. Oignon. Harissa. Riz. Sel. Poivre. Menthe sechee. Huile d olive. Tomates fraiches.	Nettoyer les calamars et reserver les poches. Hacher les tentacules avec le persil, une partie de l oignon, l ail, le riz, la menthe sechee, le sel, le poivre et un peu de harissa pour preparer la farce. Remplir les calamars sans trop tasser puis fermer. Faire revenir l oignon restant dans l huile d olive, ajouter tomates fraiches, tomate concentree, harissa et un peu d eau, puis laisser mijoter avec les calamars jusqu a cuisson tendre et sauce reduite.	25	45	Facile	4	2026-05-30 17:11:15.783	2026-05-30 17:11:15.783	4	1
140	Sandwich Malfouf tunisien	Le sandwich malfouf tunisien est un pain maison cuit a la poele puis roule autour d une farce composee de thon ou de poulet, fromage, laitue, roquette, tomates cerises et sauces relevees. C est un sandwich de street food moelleux et tres gourmand.	/recipes/sandwich-malfouf-tunisien.jpg	Farine. Semoule fine. Sel. Eau tiede. Thon ou poulet cuit et emiette. Fromage. Harissa. Moutarde. Laitue. Roquette. Tomates cerises. Piments de cayenne.	Preparer une pate souple avec la farine, la semoule, le sel et l eau tiede, puis la diviser en boules. Etaler finement chaque boule et cuire les pains a la poele. Garnir de harissa, moutarde, laitue, roquette, fromage, thon ou poulet, tomates cerises et piments, puis rouler les pains pour former les sandwiches.	15	20	Facile	4	2026-05-30 17:23:04.831	2026-05-30 17:23:04.831	4	1
141	Spicy Burger a la tunisienne	Ce burger a la tunisienne se compose de buns maison, de steaks haches epices, de cheddar fondant et d une garniture de laitue, tomate, oignon et piments. Il est releve avec harissa, moutarde et mayonnaise pour un resultat tres savoureux.	/recipes/spicy-burger-tunisienne.jpg	Preparation hamburger ou farine. Levure boulangere. Lait. Oeuf. Jaune d oeuf. Margarine. Viande hachee. Cheddar. Moutarde. Mayonnaise. Laitue. Tomates. Oignon. Oignon caramelise. Piments de cayenne. Huile. Sel. Poivre.	Preparer une pate levee pour les buns puis la faconner et la cuire au four. Assaisonner la viande hachee, former les steaks et les cuire a la poele. Poser le cheddar sur les steaks chauds, puis garnir les buns de mayonnaise, harissa, laitue, oignon, tomate, piments et viande avant de refermer le burger.	30	20	Facile	4	2026-05-30 17:23:04.847	2026-05-30 17:23:04.847	4	1
144	Chapati Tunisien	Le chapati tunisien est une galette de pain moelleuse farcie de fromage, harissa, omelette, thon et frites. Bien chaud, il fait partie des sandwiches tunisiens les plus populaires et les plus copieux.	/recipes/chapati-tunisien.jpg	Farine. Huile d olive. Levure boulangere. Sel. Oeufs. Pommes de terre. Fromage fondu. Harissa. Thon. Oignon emince. Persil emince. Fromage rape. Huile pour friture.	Preparer une pate souple avec la farine, la levure, le sel, l huile et l eau, puis la laisser lever. Former des disques epais et les cuire sur un tajine ou dans une poele. Frire les pommes de terre, preparer des omelettes au persil, oignon et fromage rape, puis ouvrir les galettes et les garnir de fromage fondu, harissa, omelette, thon et frites.	60	60	Facile	4	2026-05-30 17:23:04.851	2026-05-30 17:23:04.851	4	1
145	Chapati Mahdia	Le chapati de Mahdia est une version locale moelleuse et fine, preparee avec farine, semoule, yaourt et lait, puis garnie selon le gout avec harissa, thon, fromage, olives ou capres. Il est cuit en demi-cercle sur plaque chaude.	/recipes/chapati-mahdia.jpg	Farine. Semoule. Sel. Levure boulangere. Levure chimique. Huile. Oeuf. Yaourt nature. Lait. Farce au choix: harissa, thon, fromage, olives, capres.	Melanger farine, semoule, sel et levures, puis ajouter l oeuf, l huile, le yaourt et le lait tiedi pour obtenir une pate souple. Laisser reposer, diviser en portions et etaler en cercles fins. Garnir selon le gout, fermer en demi-cercle puis cuire des deux cotes sur un tajine traditionnel ou une poele antiadhesive.	30	15	Facile	4	2026-05-30 17:23:04.857	2026-05-30 17:23:04.857	4	1
146	Fricasses Tunisiens au four	Ces fricasses cuits au four reprennent la garniture classique tunisienne a base de harissa, thon, pomme de terre, oeuf dur et olives, dans une version plus legere. Les pains sont moelleux et bien dores.	/recipes/fricasses-tunisiens-four.jpg	Farine. Oeufs. Eau. Lait. Huile d olive. Levure boulangere instantanee. Sel. Sucre. Harissa. Pommes de terre. Thon en conserve. Oeufs durs. Olives.	Preparer une pate levee avec la farine, la levure, le lait, l eau, les oeufs, l huile, le sucre et le sel, puis la laisser lever. Former des petites boules, les aplatir, les dorer a l oeuf et les cuire au four. Une fois refroidis, ouvrir les pains et les farcir avec harissa, pomme de terre, thon, oeufs durs et olives.	25	30	Facile	6	2026-05-30 17:23:04.859	2026-05-30 17:23:04.859	4	1
147	Baguette farcie	La baguette farcie tunisienne est un pain moelleux faconne en rouleau puis garni de harissa, poulet, oignon saute et fromage rape. Elle se coupe en tranches et se sert chaude comme un grand sandwich familial.	/recipes/baguette-farcie.jpg	Farine. Lait. Oeuf. Levure boulangere. Sel. Sucre. Harissa. Poulet cuit et hache. Oignon saute. Fromage rape. Origan.	Preparer une pate a pain avec la farine, le lait tiede, l oeuf, la levure, le sucre et le sel, puis la laisser lever. Abaisser la pate en rectangle, disposer au centre la harissa, le poulet, l oignon saute et le fromage. Rouler en boudin, badigeonner d un melange de lait et jaune d oeuf, parsemer d origan puis cuire au four avant de couper en tranches.	30	35	Facile	6	2026-05-30 17:23:04.86	2026-05-30 17:23:04.86	4	1
148	Petits pains farcis thon, poulet et fromage	Ces petits pains farcis sont tres moelleux et garnis d une farce au poulet, thon, fromage rape et creme de fromage, relevee d un peu de harissa. Ils sont parfaits pour un buffet ou un repas leger.	/recipes/petits-pains-thon-poulet-fromage.jpg	Blanc de poulet cuit et emiette. Farine. Levure chimique. Oignon hache. Poivron vert. Jaune d oeuf. Harissa. Thon. Fromage rape. Creme de fromage emmental. Creme liquide. Huile d olive. Sel.	Preparer une pate souple avec la farine, la creme liquide, la levure et le sel, puis la laisser reposer. Faire sauter le poulet avec l oignon et le poivron, puis hors du feu ajouter le thon, la creme de fromage et le fromage rape. Etaler la pate, decouper des cercles, les garnir de harissa et de farce, faconner les petits pains, dorer au jaune d oeuf et cuire au four.	20	20	Facile	6	2026-05-30 17:23:04.862	2026-05-30 17:23:04.862	4	1
149	Tajine de pates au poulet	Ce tajine de pates au poulet melange des pates cuites, du poulet emiette, du fromage, des olives, des oeufs et du persil, puis passe au four avant d etre decore d oeufs durs et de tomates cerises. C est un plat simple, familial et tres apprecie.	/recipes/tajine-pates-poulet.jpg	Poulet cuit et emiette. Pates. Tomates cerises. Persil cisele. Oeufs. Oeufs durs. Fromage rape. Olives en rondelles. Sel. Poivre. Margarine.	Cuire les pates dans une eau salee puis les egoutter. Melanger dans un saladier le poulet, le fromage, les olives et le persil, puis ajouter les oeufs et les pates. Saler, poivrer, verser dans un plat beurre et cuire au four. Laisser tiedir puis decorer avec tomates cerises et oeufs durs coupes.	10	20	Facile	4	2026-05-30 17:35:44.149	2026-05-30 17:35:44.149	4	1
150	Tajine a la pate feuilletee	Ce tajine warka a la pate feuilletee est garni d un melange de poulet, oignon, ricotta, fromage rape et oeufs, enferme entre deux couches de pate feuilletee doree au four. Il donne un resultat croustillant dehors et fondant dedans.	/recipes/tajine-pate-feuilletee.jpg	Pate feuilletee. Margarine. Oignon hache. Blanc de poulet coupe en cubes. Curcuma. Sel. Fromage rape. Ricotta. Ail hache. Oeufs.	Faire revenir le poulet et l oignon dans la margarine avec sel, curcuma et ail. Melanger ensuite cette preparation avec la ricotta, le fromage rape et les oeufs. Foncer un moule avec une premiere pate feuilletee, ajouter la farce, couvrir avec la seconde pate, souder les bords, dorer au jaune d oeuf et cuire au four jusqu a belle coloration.	15	30	Facile	4	2026-05-30 17:35:44.173	2026-05-30 17:35:44.173	4	1
151	Tajine Minina tunisienne	La tajine minina, ou omelette juive, est un tajine leger au poulet, carottes, persil, oeufs et citron, cuit au four dans un moule. Sa texture est moelleuse et son gout tres delicat.	/recipes/tajine-minina-tunisienne.jpg	Blanc de poulet en des. Oignon hache. Persil cisele. Carottes en des. Ail hache. Oeufs durs. Oeufs. Jus de citron. Huile. Sel. Poivre.	Faire revenir l oignon et le poulet dans l huile, ajouter les carottes puis l ail et un peu de jus de citron. Assaisonner et laisser refroidir. Melanger ensuite avec les oeufs durs haches, le persil et les oeufs battus, verser dans un moule puis cuire au four jusqu a prise complete.	15	15	Facile	4	2026-05-30 17:35:44.176	2026-05-30 17:35:44.176	4	1
152	Tajine El bey : Nouvelle facon de cuisson	Le tajine El bey est ici propose en trois couches: une base de viande hachee et fromage, une couche d epinards, puis une finition a la ricotta et blancs d oeufs. Le tout est cuit au four et decore de pistaches hachees.	/recipes/tajine-el-bey-nouvelle-facon.jpg	Viande hachee. Epinards. Fromage rape. Ricotta. Oeufs. Feuilles de malsouka. Sel. Poivre. Pistaches hachees.	Melanger la viande hachee avec le fromage rape et une partie des oeufs, verser dans un moule puis couvrir d une feuille de malsouka. Melanger les epinards avec les jaunes d oeufs et les disposer en seconde couche avec une autre feuille de malsouka. Terminer par la ricotta melangee aux blancs d oeufs, cuire au four puis laisser refroidir avant de couper et decorer de pistaches.	15	30	Facile	4	2026-05-30 17:35:44.177	2026-05-30 17:35:44.177	4	1
153	Tajine de salade mechouia (tajine slata)	Ce tajine slata revisite la salade mechouia dans une version cuite au four avec viande en des, citron confit, fromage rape et oeufs. Il est parfume, legerement pimente et tres typique de la cuisine tunisienne.	/recipes/tajine-salade-mechouia.jpg	Poivrons doux. Tomates. Oignons. Coriandre moulue. Viande en des. Huile d olive. Curcuma. Sel. Poivre. Oeufs. Citron confit. Fromage rape. Smen.	Preparer une salade mechouia en petits morceaux puis l assaisonner. Cuire la viande avec une partie des oignons, l huile d olive, le sel, le poivre et le curcuma. Melanger la viande avec la salade, le citron confit, le fromage rape et les oeufs, verser dans un moule beurre, ajouter une noix de smen et cuire au four avant de laisser refroidir et couper en tranches.	30	30	Facile	6	2026-05-30 17:35:44.179	2026-05-30 17:35:44.179	4	1
154	Tajine des biscuits sales	Ce tajine original alterne des couches de biscuits sales avec une farce au poulet hache, creme fraiche, ricotta et oeufs. Il est simple, rapide et donne une texture tres fondante.	/recipes/tajine-biscuits-sales.jpg	Biscuits sales type tuc. Oeufs. Creme fraiche epaisse. Sel. Poivre. Ricotta. Poulet hache. Petit oignon.	Faire revenir le poulet hache avec l oignon, le sel et le poivre. Ajouter ensuite les jaunes d oeufs et la creme fraiche. Monter les blancs avec la ricotta, puis disposer dans un moule une couche de biscuits, la preparation au poulet, le melange ricotta-blancs et enfin une autre couche de biscuits. Cuire au four jusqu a bonne tenue.	15	30	Facile	4	2026-05-30 17:35:44.183	2026-05-30 17:35:44.183	4	1
155	Quiche aux epinards et a la ricotta	Cette quiche aux epinards et a la ricotta repose sur une pate brisee maison et une garniture cremeuse aux epinards, ricotta, oeufs et creme. Elle se sert tiede ou froide avec une salade.	/recipes/quiche-epinards-ricotta.jpg	Farine. Beurre. Sucre. Jaune d oeuf. Eau. Epinards. Creme fraiche epaisse. Noix de muscade. Ricotta. Oeufs. Huile d olive. Sel. Poivre.	Preparer une pate brisee avec farine, beurre, sucre, eau et jaune d oeuf, puis la laisser reposer au frais. Faire revenir les epinards dans l huile d olive, les egoutter et les hacher. Battre les oeufs avec la creme, ajouter la ricotta, les epinards, la muscade, le sel et le poivre, verser sur la pate et cuire au four jusqu a ce que la quiche soit bien prise.	25	30	Facile	6	2026-05-30 17:35:44.184	2026-05-30 17:35:44.184	4	1
156	Tajine Tunisien en croute (a la viande hachee)	Ce tajine en croute enferme une farce de viande hachee, epinards, riz et fromages dans une pate feuilletee doree. Il est genereux, croustillant et tres pratique a servir en parts.	/recipes/tajine-croute-viande-hachee.jpg	Pate feuilletee. Viande hachee. Epinards frais. Riz. Fromage fondu. Fromage rape. Oeufs. Oignon. Sel. Poivre. Curcuma. Huile d olive. Olives pour decor.	Cuire le riz et le reserver. Faire revenir la viande avec l oignon, les epinards et le curcuma dans l huile d olive, puis assaisonner. Melanger avec le riz, le fromage rape, le fromage fondu en des et les oeufs. Deposer la farce au centre d une pate feuilletee, rabattre les cotes, badigeonner d oeuf battu, decorer et cuire au four jusqu a ce que la croute soit bien doree.	25	25	Facile	6	2026-05-30 17:35:44.186	2026-05-30 17:35:44.186	4	1
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Review" (id, rating, comment, "createdAt", "userId", "dishId") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, "firstName", "lastName", email, password, phone, city, address, role, "createdAt", "updatedAt", "emailVerified", "emailVerificationToken", "emailVerificationExpires", "sellerSubscriptionStatus", "sellerSubscriptionExpiresAt", "sellerSubscriptionReference", "sellerSubscriptionProof") FROM stdin;
3	Admin	CookMarket	admin@cookmarket.tn	$2b$10$ddv6QabZ4a3KA219qCO3WeR0fC7tofmuovW8lyKsh1SAeVx61CQ0e	\N	\N	\N	ADMIN	2026-05-29 14:33:49.668	2026-05-29 14:33:49.668	t	\N	\N	INACTIVE	\N	\N	\N
4	Maryem	Turki	client@cookmarket.tn	$2b$10$ddv6QabZ4a3KA219qCO3WeR0fC7tofmuovW8lyKsh1SAeVx61CQ0e	\N	Sousse	\N	CLIENT	2026-05-29 14:33:49.67	2026-05-29 14:33:49.67	t	\N	\N	INACTIVE	\N	\N	\N
5	ChanebPlusSahloul	 	chanebplussahloul@cookmarket.tn	$2b$10$ddv6QabZ4a3KA219qCO3WeR0fC7tofmuovW8lyKsh1SAeVx61CQ0e	+216 00 000 000	Sahloul	\N	SELLER	2026-05-30 19:37:16.959	2026-05-30 19:37:16.959	t	\N	\N	ACTIVE	2027-05-30 19:37:16.959	\N	\N
6	Omek	Houria	omekhouria@cookmarket.tn	$2b$10$ddv6QabZ4a3KA219qCO3WeR0fC7tofmuovW8lyKsh1SAeVx61CQ0e	+216 00 000 001	Sousse	\N	SELLER	2026-05-30 21:11:56.717	2026-05-30 21:11:56.729	t	\N	\N	ACTIVE	2027-05-30 21:11:56.729	\N	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
9015dfd4-e6c0-4a00-bb5d-40ebf8bc9a86	26ad4f33d632002d384a629c99cb20ca93e22ef057e12a4cca06e0a064cbae41	2026-05-28 19:33:48.203679+01	20260504002707_init	\N	\N	2026-05-28 19:33:48.122739+01	1
f1607982-e1b9-4918-a9a2-00a0f35ce8e3	4b919b4dc0cb548b948183aec89577194accda8aae56c027b886975d915ba477	2026-05-28 19:33:48.223611+01	20260525180000_add_formations_orders_checkout	\N	\N	2026-05-28 19:33:48.204755+01	1
8d49eae4-be6e-4e85-b338-e727afd4c09c	0128dd6baedaa882fac66a5113c4215c7e31587aaff431f25fd5df2b45c2e841	2026-05-28 19:33:48.228308+01	20260525181709_add_seller_paid_to_orders	\N	\N	2026-05-28 19:33:48.224229+01	1
82337a33-912d-402a-8742-c62d3a161bb6	be37d76c04a114deadb1b4131e67e6dab8e0a00690ddc082acfbcffc131270a7	2026-05-29 15:33:38.67576+01	20260528113000_add_email_verification	\N	\N	2026-05-29 15:33:38.58063+01	1
874b04fb-ed90-4698-b283-4393b36e6c85	3374bbfe0231c8b09991725ee34c2c785bc7f6066bf17957f0e31f3fe0fa3111	2026-05-29 15:33:38.689637+01	20260528124500_add_d17_payment_proof_to_orders	\N	\N	2026-05-29 15:33:38.686771+01	1
4d193424-2b34-40b4-beb7-3a2915f11659	64ab405b16cbbba1350807a78ef2f6f8854f5c0d745f96975a3ea5352cf13f1d	2026-05-29 15:33:38.704928+01	20260528133000_add_seller_subscription	\N	\N	2026-05-29 15:33:38.699361+01	1
\.


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 1, true);


--
-- Name: Comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Comment_id_seq"', 1, false);


--
-- Name: Dish_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Dish_id_seq"', 77, true);


--
-- Name: Formation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Formation_id_seq"', 6, true);


--
-- Name: OrderItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OrderItem_id_seq"', 1, false);


--
-- Name: Order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Order_id_seq"', 1, false);


--
-- Name: Recipe_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Recipe_id_seq"', 156, true);


--
-- Name: Review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Review_id_seq"', 1, false);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 6, true);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: Dish Dish_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Dish"
    ADD CONSTRAINT "Dish_pkey" PRIMARY KEY (id);


--
-- Name: Formation Formation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Formation"
    ADD CONSTRAINT "Formation_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Recipe Recipe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recipe"
    ADD CONSTRAINT "Recipe_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_emailVerificationToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_emailVerificationToken_key" ON public."User" USING btree ("emailVerificationToken");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Comment Comment_recipeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES public."Recipe"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Comment Comment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Dish Dish_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Dish"
    ADD CONSTRAINT "Dish_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Dish Dish_sellerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Dish"
    ADD CONSTRAINT "Dish_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Formation Formation_sellerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Formation"
    ADD CONSTRAINT "Formation_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_dishId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES public."Dish"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OrderItem OrderItem_formationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES public."Formation"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Recipe Recipe_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recipe"
    ADD CONSTRAINT "Recipe_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Recipe Recipe_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recipe"
    ADD CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Review Review_dishId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES public."Dish"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Review Review_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict R4toGZqcw2IJPFSGFAy1gspPuB4agWIDZlad7GtY7xAujGAV5oPqsSAGs1EgfFy

