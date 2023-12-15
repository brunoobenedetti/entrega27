import { Router } from 'express';

const router = Router();

const privateRouter = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

const publicRouters = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/products');
    }
    next();
}

router.get('/profile', privateRouter, (req, res) => {
    res.render('profile', { title: 'Perfil', user: req.session.user });
});

router.get('/login', publicRouters, (req, res) => {
    res.render('login', { title: 'Login' });
});

router.get('/register', publicRouters, (req, res) => {
    res.render('register', { title: 'Register' });
});
router.get('/password-recovery', publicRouters, (req, res) => {
    res.render('password-recovery', { title: "Recuperar password" })
})

router.get('/', (req, res) => {
    res.send('<h1>Hello People 😎!</h1>');
});

export default router;