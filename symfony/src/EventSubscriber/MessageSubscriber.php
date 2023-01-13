<?php

namespace App\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Message;
use App\Entity\User;
use App\Service\MercurePublisher;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class MessageSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly Security         $security,
        private readonly MercurePublisher $mercurePublisher
    )
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => [
                ['setUser', EventPriorities::PRE_VALIDATE],
                ['publishToMercure', EventPriorities::POST_WRITE],
            ],
        ];
    }

    public function setUser(ViewEvent $event)
    {
        $message = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        $user = $this->security->getUser();

        if (!($user instanceof User) || !($message instanceof Message) || Request::METHOD_POST !== $method) {
            return;
        }

        $message->setUser($user);
    }

    public function publishToMercure(ViewEvent $event)
    {
        $message = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!($message instanceof Message) || Request::METHOD_POST !== $method) {
            return;
        }

        $this->mercurePublisher->publishMessage($message);
    }
}
