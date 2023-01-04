<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * @throws NonUniqueResultException
     */
    public function findOneByUsername(string $username): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.username = :username')
            ->setParameter('username', $username)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param string $searchQuery
     * @param User[]|array $exclude
     * @return User[]|array
     */
    public function searchByUsernameOrEmail(string $searchQuery, array $exclude = []): array
    {
        $qb = $this->createQueryBuilder('u')
            ->andWhere('u.username LIKE :query')
            ->orWhere('u.email LIKE :query')
            ->setParameter('query', '%' . $searchQuery . '%');

        if (count($exclude) > 0) {
            $qb
                ->andWhere('u NOT IN (:users)')
                ->setParameter('users', $exclude);
        }

        return $qb->getQuery()->getResult();
    }
}
