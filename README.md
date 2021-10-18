# lovewall

> A lovewall with nine confess sheets attached.
>
> A utopia where unrequited lovers declare their love.
>
> A [zjutjh](https://github.com/zjutjh) probation project developed by bbq team 3.

[Origin repository link](https://git.zjutjh.com/j10c/j10c_lovewall)

- major front-end part of lovewall was developed by @j10ccc

- some beautification works was contributed by @Jiang Qijun and @Yu Zengyi

- major backend part of lovewall was developed by @Patrick-Star-CN and @Maowei, also the database was design by him.

## Usage
1. Clone the repository.

2. To Run in local environment, you should checkout to `dev` branch and if not, use `main` branch modifying server IP in `/src/*.js`.

3. deploy all of files except `go.sum go.mod main.go` to your web server like `live server` or `Nginx`.

4. Next set up a database `mysql`, like the one below.

   ```mysql
   +--------------------+
   | Tables_in_lovewall |
   +--------------------+
   | commentdata        |
   | confessdata        |
   | userdata           |
   +--------------------+
   ```

   ```mysql
   mysql> describe commentdata;
   +-----------+--------------+------+-----+---------+----------------+
   | Field     | Type         | Null | Key | Default | Extra          |
   +-----------+--------------+------+-----+---------+----------------+
   | id        | int unsigned | NO   | PRI | NULL    | auto_increment |
   | confessid | varchar(10)  | NO   |     | NULL    |                |
   | content   | varchar(200) | NO   |     | NULL    |                |
   | username  | varchar(16)  | NO   |     |         |                |
   | tidyname  | varchar(10)  | NO   |     | NULL    |                |
   +-----------+--------------+------+-----+---------+----------------+
   5 rows in set (0.00 sec)
   ```

   ```mysql
   mysql> describe confessdata;
   +-----------+--------------+------+-----+---------+----------------+
   | Field     | Type         | Null | Key | Default | Extra          |
   +-----------+--------------+------+-----+---------+----------------+
   | id        | int          | NO   | PRI | NULL    | auto_increment |
   | uid       | varchar(10)  | NO   |     | NULL    |                |
   | username  | varchar(16)  | NO   |     | NULL    |                |
   | content   | varchar(200) | NO   |     | NULL    |                |
   | tidyname  | varchar(10)  | NO   |     | NULL    |                |
   | anonymous | tinyint(1)   | NO   |     | NULL    |                |
   | color     | int unsigned | NO   |     | 0       |                |
   +-----------+--------------+------+-----+---------+----------------+
   7 rows in set (0.00 sec)
   ```

   ```mysql
   mysql> describe userdata;
   +----------+---------------+------+-----+---------+----------------+
   | Field    | Type          | Null | Key | Default | Extra          |
   +----------+---------------+------+-----+---------+----------------+
   | id       | int unsigned  | NO   | PRI | NULL    | auto_increment |
   | username | varchar(16)   | NO   |     | NULL    |                |
   | password | varchar(1000) | NO   |     | NULL    |                |
   | tidyname | varchar(10)   | NO   |     | NULL    |                |
   +----------+---------------+------+-----+---------+----------------+
   4 rows in set (0.00 sec)
   ```

5. Copy `go.sum go.mod main.go`  to your workspace in `GOPATH` . Set up the environment.

  ```go
  go run main.go
  ```

	If the program doesn't report an error about `mysql` , enjoy it!

## Thanks

Thanks all member in our team. 

```
front-end programer:
@j10ccc
@Jiang Qijun
@Yu Zengyi

backend programer:
@Patrick-Star-CN
@Maowei
```

Hope we can learn more development knowledge in zjutjh in the future.

   
