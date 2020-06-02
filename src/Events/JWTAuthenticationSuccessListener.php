<?php

namespace App\Events;

use Exception;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\HttpFoundation\Cookie;


class JWTAuthenticationSuccessListener
{
    /**
     * @var int
     */
    private $tokenLifetime;

    public function __construct(int $tokenLifetime)
    {
        $this->tokenLifetime = $tokenLifetime;
    }

    /**
     * Sets JWT as a cookie on successful authentication.
     */
    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event): void
    {
        $event->getResponse()->headers->setCookie(
            new Cookie(
                'JWT', // Cookie name, should be the same as in config/packages/lexik_jwt_authentication.yaml.
                $event->getData()['token'], // cookie value
                time() + $this->tokenLifetime, // expiration
                '/', // path
                null, // domain, null means that Symfony will generate it on its own.
                false, // secure
                true, // httpOnly
                false, // raw
                'lax' // same-site parameter, can be 'lax' or 'strict'.
            )
        );

        dd($event->getResponse()->headers);
    }
}