<?php

namespace App\Events;

use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class InvoiceChronoSubscriber implements EventSubscriberInterface
{
    private $security;
    private $repo;

    public function __construct(Security $security, InvoiceRepository $repo)
    {
        $this->security = $security;
        $this->repo = $repo;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setInvoiceChrono', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setInvoiceChrono(ViewEvent $event)
    {
        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        
        if($invoice instanceof Invoice && $method == 'POST')
        {
            $user = $this->security->getUser();
            
            if($user !== $invoice->getCustomer()->getUser())
            {
                throw new AccessDeniedHttpException("Game over: This customer is not one of yours. Try again!");
            }

            $invoice->setChrono($this->repo->findNextChrono($user));
        }
    }
}